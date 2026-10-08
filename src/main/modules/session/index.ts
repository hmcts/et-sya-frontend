import config from 'config';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import { ClientOpts, createClient } from 'redis';
import FileStoreFactory from 'session-file-store';

import { LOCAL_REDIS_SERVER } from '../../definitions/constants';

const RedisStore = ConnectRedis(session);
const FileStore = FileStoreFactory(session);

const cookieMaxAge = 60 * (60 * 1000); // 60 minutes
const sessionPrefix = 'et-sya-session:';
const defaultRedisPort = 10000; // Azure Managed Redis

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
        secret: config.get('session.secret') as string,
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

  private getStore(app: Application) {
    const redisHost: string = process.env.REDIS_HOST ?? config.get('session.redis.host');
    if (!redisHost) {
      return new FileStore({ path: '/tmp', reapInterval: -1 });
    }

    const clientOptions: ClientOpts =
      redisHost === LOCAL_REDIS_SERVER
        ? {
            host: redisHost,
            port: 6379,
            tls: false,
            connect_timeout: 15000,
            prefix: sessionPrefix,
          }
        : {
            host: redisHost,
            port: parsePort(process.env.REDIS_PORT, defaultRedisPort),
            tls: true,
            connect_timeout: 15000,
            password: config.get('session.redis.key') as string,
            prefix: sessionPrefix,
          };

    const client = createClient(clientOptions);
    app.locals.redisClient = client;
    return new RedisStore({ client });
  }
}
