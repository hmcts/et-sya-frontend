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
    // Check body first (for regular form posts and after Multer parsing)
    const bodyToken = (req.body as Record<string, unknown>)?._csrf as string | undefined;
    if (bodyToken) {
      return bodyToken;
    }
    // Check headers as fallback

    return req.headers['x-csrf-token'] as string | undefined;
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

export default class CSRFToken {
  public enableFor(app: Application): void {
    // Middleware to generate and store CSRF token for all requests
    app.use((req: AppRequest, res, next) => {
      if (req.session) {
        try {
          // Ensure session is initialized by touching it
          if (!req.session.csrfInitialized) {
            req.session.csrfInitialized = true;
          }
          res.locals.csrfToken = generateCsrfToken(req, res);
        } catch (error) {
          logger.error('Failed to generate CSRF token:', error);
          // Continue without CSRF token - protection will be skipped for this request
        }
      }
      next();
    });

    // Apply CSRF protection to POST/PUT/DELETE/PATCH requests
    // Skip routes with file uploads - they will apply CSRF after Multer parses the body
    app.use((req: AppRequest, res, next) => {
      // Skip CSRF if disabled (e.g., in tests)
      if (req.app.locals.CSRF_DISABLED) {
        return next();
      }

      // Skip CSRF validation for multipart/form-data routes
      // These routes will apply CSRF protection after Multer middleware
      const skipCsrfPaths = [
        '/describe-what-happened',
        '/tribunal-contact-selected',
        '/respondent-supporting-material',
        '/hearing-document-upload',
      ];

      if (skipCsrfPaths.includes(req.path) && req.method !== 'GET') {
        return next();
      }

      doubleCsrfProtection(req, res, next);
    });

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

// Export CSRF protection middleware for use after Multer in specific routes
// This wrapper respects the CSRF_DISABLED flag for testing
export const csrfProtection = (req: AppRequest, res: express.Response, next: NextFunction): void => {
  if (req.app.locals.CSRF_DISABLED) {
    return next();
  }
  doubleCsrfProtection(req, res, next);
};
