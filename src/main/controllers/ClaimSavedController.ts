import { Request, Response } from 'express';

export default class ClaimSavedController {
  public get(req: Request, res: Response): void {
    res.render('claim-saved', {
      ...req.t('claim-saved', { returnObjects: true }),
    });
  }
}
