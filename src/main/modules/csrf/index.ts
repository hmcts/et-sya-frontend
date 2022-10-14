import csurf from 'csurf';
import type { Application } from 'express';
import express, { NextFunction } from 'express';

import { HTTPError } from '../../HttpError';
import { AppRequest } from '../../definitions/appRequest';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('CSRF');

const INVALID_CSRF_CODE = 'EBADCSRFTOKEN';

export class CSRFToken {
  public enableFor(app: Application): void {
    app.use(csurf(), (req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    });

    app.use((error: HTTPError, req: AppRequest, res: express.Response, next: NextFunction) => {
      if (error.code === INVALID_CSRF_CODE) {
        logger.error(JSON.stringify(error));
        return res.redirect('not-found');
      }
      next();
    });
  }
}
