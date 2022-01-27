import { Request, Response } from 'express';

export default class NewAccountLandingController {
    
    public get(req: Request, res: Response): void {
        res.render('new-account-landing', {
          ...(req.t('new-account-landing', { returnObjects: true })),
        });
      }
}