import { LOCAL_REDIS_SERVER } from '../../definitions/constants';

import config from 'config';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';
import { log } from 'winston';

let redis;
try {
  redis = require('redis');
} catch (err) {
  log('error', 'Redis not found - continuing');
}

type Redis = typeof redis;
const { ClientOpts, createClient } = redis as Redis;
const RedisStore = ConnectRedis(session);
const FileStore = FileStoreFactory(session);

const cookieMaxAge = 60 * (60 * 1000); // 60 minutes

export class Session {
  public enableFor(app: Application): void {
    app.use(cookieParser());
    app.set('trust proxy', 1);

    app.use(
      session({
        name: 'et-sya-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('session.secret'),
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
    const redisHost = config.get('session.redis.host') as string;
    if (redisHost) {
      const clientOptions: typeof ClientOpts =
        redisHost === LOCAL_REDIS_SERVER
          ? {
              host: redisHost,
              port: 6379,
              tls: false,
              connect_timeout: 15000,
            }
          : {
              host: redisHost,
              port: 6380,
              tls: true,
              connect_timeout: 15000,
              password: config.get('session.redis.key') as string,
            };

      const client = createClient(clientOptions);
      app.locals.redisClient = client;
      return new RedisStore({ client });
    }
    return new FileStore({ path: '/tmp', reapInterval: -1 });
  }
}
