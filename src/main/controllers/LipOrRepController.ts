import { Request, Response } from 'express';
import { LEGACY_URLS } from '../definitions/constants';

export default class LipOrRepController {

  public get(req: Request, res: Response): void {
    res.render('lip-or-representative', {
      ...(req.t('lip-or-representative', { returnObjects: true })),
    });
  }

  public post(req: Request, res: Response): void {
    if (req.body['lip-or-representative'] === 'lip') {
      res.redirect('/single-or-multiple-claim');
    }
    else if (req.body['lip-or-representative'] === 'representative') {
      res.redirect(LEGACY_URLS.ET1);
    } else {
      res.render('lip-or-representative', {
        noRadioButtonSelectedError: true,
        ...(req.t('lip-or-representative', { returnObjects: true })),
      });
    }
  }
}
