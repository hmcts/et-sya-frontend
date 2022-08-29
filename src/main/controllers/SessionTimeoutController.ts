import config from 'config';
import { Response } from 'express';
import moment from 'moment';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class SessionTimeoutController {
  public getExtendSession = (req: AppRequest, res: Response): void => {
    const timeout = moment().add(config.get('session.maxAgeInMs'), 'milliseconds');
    console.log('Extend session - setting timeout, ' + timeout);
    res.send({ timeout });
  };

  public getSessionEnded = (req: AppRequest, res: Response): void => {
    console.log('Session ending and being destroyed');
    res.locals.isLoggedIn = false;
    req.session.destroy(() => {
      console.log('inside session destroy, redirecting to home');
      res.redirect(PageUrls.HOME);
    });
  };
}

// export const getSessionEnded = (req: AppRequest, res: Response): void => {
//   console.log('Session ending and being destroyed');
//   res.locals.isLoggedIn = false;
//   req.session.destroy(() => res.redirect(PageUrls.HOME));
// };

// export const checkSession = (req: AppRequest, res: Response, next: NextFunction): void | undefined => {
//   if (req.session?.user?.accessToken) {
//     console.log('user has access token')
//     next();
//   }
//   console.log('user does not have access token, returning.... ')
//   return
// }
