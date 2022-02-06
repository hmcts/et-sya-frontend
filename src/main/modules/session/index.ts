import config from 'config';
import { Application } from 'express';
import session from 'express-session';

const cookieMaxAge = 21 * (60 * 1000); // 21 minutes

export class Session {
  enableFor(app: Application): void {
    app.use(
      session({
        name: 'ef-sya-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('session.secret'),
        cookie: {
          httpOnly: true,
          maxAge: cookieMaxAge,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
      })
    );
  }
}
