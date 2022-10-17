import csurf from 'csurf';
import type { Application } from 'express';
import express, { NextFunction } from 'express';

import { HTTPError } from '../../HttpError';
import { AppRequest } from '../../definitions/appRequest';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('CSRF');

const INVALID_CSRF_CODE = 'EBADCSRFTOKEN';

const csrf = csurf({ cookie: false }); // DON'T ENABLE COOKIE, VULNERABILITY WITH CSURF

// todo
// test multiple forms on preview (get1, get2, post1, post2)
// Error page & tests (for error page, and for csrf using an app that enables this Token class)
export default class CSRFToken {
  public enableFor(app: Application): void {
    app.use(csrf, (req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    });

    app.use((error: HTTPError, req: AppRequest, res: express.Response, next: NextFunction) => {
      if (req.app.locals.CSRF_DISABLED) {
        return next();
      }

      if (error.code === INVALID_CSRF_CODE) {
        logger.error(error.message);
        return res.redirect('not-found');
      }

      next();
    });
  }
}
