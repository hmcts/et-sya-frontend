import { getRedirectUrl, getUserDetails } from '../../auth';
import { Application, Response } from 'express';
import { AppRequest } from '../../definitions/appRequest';
import config from 'config';
import {
  CALLBACK_URL,
  HOME,
  HTTPS_PROTOCOL,
  LOGIN,
  LOGOUT,
} from '../../definitions/constants';

export class Oidc {
  public enableFor(app: Application): void {
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const serviceUrl = (res: Response): string =>
      `${HTTPS_PROTOCOL}${res.locals.host}${port}`;

    app.get(LOGIN, (_, res) => {
      res.redirect(getRedirectUrl(serviceUrl(res), CALLBACK_URL));
    });

    app.get(LOGOUT, (req, res) => {
      // TODO(Tautvydas): this should redirect to the signout page
      req.session.destroy(() => res.redirect(HOME));
    });

    app.get(CALLBACK_URL, async (req: AppRequest, res: Response) => {
      if (typeof req.query.code === 'string') {
        req.session.user = await getUserDetails(
          serviceUrl(res),
          req.query.code,
          CALLBACK_URL,
        );
        // TODO(Tautvydas): this should redirect to the next page in the queue
        req.session.save(() => res.redirect(HOME));
      } else {
        res.redirect(LOGIN);
      }
    });
  }
}
