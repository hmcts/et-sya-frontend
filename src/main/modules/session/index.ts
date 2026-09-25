import config from 'config';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import { ClientOpts, RedisClient, createClient } from 'redis';
import FileStoreFactory from 'session-file-store';

import { LOCAL_REDIS_SERVER } from '../../definitions/constants';
import { createDualWriteRedisClient } from '../../utils/DualWriteRedisClient';

const RedisStore = ConnectRedis(session);
const FileStore = FileStoreFactory(session);

const cookieMaxAge = 60 * (60 * 1000); // 60 minutes
const sessionPrefix = 'et-sya-session:';
const defaultRedisPort = 6380;
const defaultSecondaryRedisPort = 10000; // Azure Managed Redis

/**
 * Falls back when the variable is unset, empty or not a usable port, so that a
 * blank value in a Helm override cannot quietly become port 0.
 */
const parsePort = (value: string | undefined, fallback: number): number => {
  const port = Number(value);

  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : fallback;
};

export class Session {
  public enableFor(app: Application): void {
    app.use(cookieParser());
    app.set('trust proxy', 1);

    app.use(
      session({
        name: 'et-sya-session',
        resave: false,
        saveUninitialized: false,
        secret: this.getSecret(),
        cookie: {
          httpOnly: true,
          maxAge: cookieMaxAge,
          sameSite: 'lax', // required for the oauth2 redirect
          secure: !app.locals.developmentMode,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(app),
      })
    );
  }

  /**
   * Cookies are signed with the first secret and verified against all of them, so
   * mounting the secret that was previously in use keeps people signed in across
   * a rotation.
   */
  private getSecret(): string | string[] {
    const secret = config.get('session.secret') as string;
    const previousSecret = config.has('session.previousSecret') ? (config.get('session.previousSecret') as string) : '';

    return previousSecret && previousSecret !== secret ? [secret, previousSecret] : secret;
  }

  private getStore(app: Application) {
    const redisHost: string = process.env.REDIS_HOST ?? config.get('session.redis.host');
    if (!redisHost) {
      // Jest workers share the process filesystem; a shared FileStore under /tmp races
      // across maxWorkers and produces flaky route status codes (403/404/503).
      if (process.env.NODE_ENV === 'test') {
        return new session.MemoryStore();
      }
      return new FileStore({ path: '/tmp', reapInterval: -1 });
    }

    const primary = this.createRedisClient(
      redisHost,
      parsePort(process.env.REDIS_PORT, defaultRedisPort),
      config.get('session.redis.key') as string
    );

    // While the move to Azure Managed Redis is in flight both instances are live:
    // writes reach both, and REDIS_READ_FROM decides which one answers reads. The
    // chart always sets the secondary host, so REDIS_DUAL_WRITE_ENABLED is what
    // turns this on for an environment.
    if (process.env.REDIS_DUAL_WRITE_ENABLED !== 'true') {
      app.locals.redisClient = primary;
      return new RedisStore({ client: primary });
    }

    const secondaryHost = process.env.REDIS_SECONDARY_HOST;
    const secondary = this.createRedisClient(
      secondaryHost,
      parsePort(process.env.REDIS_SECONDARY_PORT, defaultSecondaryRedisPort),
      config.has('session.redis.secondaryKey') ? (config.get('session.redis.secondaryKey') as string) : ''
    );

    const client =
      process.env.REDIS_READ_FROM === 'secondary'
        ? createDualWriteRedisClient(secondary, primary)
        : createDualWriteRedisClient(primary, secondary);

    app.locals.redisClient = client;
    return new RedisStore({ client });
  }

  private createRedisClient(host: string, port: number, password: string): RedisClient {
    const clientOptions: ClientOpts =
      host === LOCAL_REDIS_SERVER
        ? {
            host,
            port: 6379,
            tls: false,
            connect_timeout: 15000,
            prefix: sessionPrefix,
          }
        : {
            host,
            port,
            tls: true,
            connect_timeout: 15000,
            password,
            prefix: sessionPrefix,
          };

    return createClient(clientOptions);
  }
}
