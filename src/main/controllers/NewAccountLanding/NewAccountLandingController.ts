import { Response } from 'express';
import { AppRequest } from '../../definitions/appRequest';

export default class NewAccountLandingController {
    
  public get = (req: AppRequest, res: Response): void => {     
        res.render('new-account-landing', {
          ...req.t('common', { returnObjects: true }),
          ...(req.t('new-account-landing', { returnObjects: true }))
        });
      }
}