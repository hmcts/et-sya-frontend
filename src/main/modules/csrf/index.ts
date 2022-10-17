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
// Test multiple forms on preview (get1, get2, post1, post2)
// Tests (csrf works, csrf altered)

// Todo also think of everywhere we switched an app to a mockapp, maybe we want to check more closely that
// having more information doesn't defeat the purpose of the test.
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
