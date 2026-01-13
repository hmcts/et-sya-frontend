import config from 'config';
import { doubleCsrf } from 'csrf-csrf';
import type { Application, Request } from 'express';
import express, { NextFunction } from 'express';

import { HTTPError } from '../../HttpError';
import { AppRequest } from '../../definitions/appRequest';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('CSRF');

const { invalidCsrfTokenError, doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || config.get('csrf.secret'),
  getSessionIdentifier: (req: Request) => {
    return (req as AppRequest).sessionID || 'no-session';
  },
  getCsrfTokenFromRequest: (req: Request) => {
    return (req.body as Record<string, unknown>)?._csrf as string | undefined;
  },
  size: 64,
});

export default class CSRFToken {
  public enableFor(app: Application): void {
    // Middleware to generate and store CSRF token for all requests
    app.use((req: AppRequest, res, next) => {
      if (req.session) {
        res.locals.csrfToken = generateCsrfToken(req, res);
      }
      next();
    });

    // Apply CSRF protection to POST/PUT/DELETE/PATCH requests
    app.use(doubleCsrfProtection);

    // Error handler for CSRF validation failures
    app.use((error: Error | HTTPError, req: AppRequest, res: express.Response, next: NextFunction) => {
      if (req.app.locals.CSRF_DISABLED) {
        return next();
      }

      if (error instanceof Error && error.message === invalidCsrfTokenError.message) {
        logger.error('Invalid CSRF token');
        return res.redirect('not-found');
      }

      next(error);
    });
  }
}
