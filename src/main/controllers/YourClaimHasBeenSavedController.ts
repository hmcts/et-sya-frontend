import { Request, Response } from 'express';

export default class YourClaimHasBeenSavedController {
  public get(req: Request, res: Response): void {
    res.render('your-claim-has-been-saved', {
      ...(req.t('your-claim-has-been-saved', { returnObjects: true })),
    });
  }
}
