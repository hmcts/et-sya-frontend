//import idamExpressMiddleware from '@hmcts/ia-idam-express-middleware';
//import config from 'config';
import { Request, Response } from 'express';
import moment from 'moment';
//import { idamConfig } from '../config/idam-config';
// import { checkSession } from '../middleware/session-middleware';
// import { paths } from '../paths';

function getExtendSession(req: Request, res: Response): void {
  console.log('get Extend Session - about to extend session');
  const timeout = moment().add(300000, 'milliseconds');
  console.log('sending this timeout', timeout);
  res.send({ timeout });
}

function getSessionEnded(req: Request, res: Response): void {
  console.log('########################################');
  console.log('########################################');
  console.log('ending session');
  console.log('########################################');
  console.log('########################################');

  res.locals.isLoggedIn = false;
  // make sure user session ends and user is logged out
  //return
  res.render('session-ended.njk');
}

// function setupSessionController() {
//   const router = Router();
// //  router.get(paths.common.extendSession, idamExpressMiddleware.protect(idamConfig), checkSession(idamConfig), getExtendSession);
//   router.get('/extend-session', getExtendSession);
//   router.get('/session-ended,', getSessionEnded);
//   return router;
// }

export {
  getExtendSession,
  getSessionEnded,
  // setupSessionController
};
