import { Request, Response } from 'express';
import { URLS } from '../definitions/constants';

export default class SingleOrMultipleController {
  public get(req: Request, res: Response): void {
    res.render('single-or-multiple-claim', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('single-or-multiple-claim', { returnObjects: true }),
    });
  }

  public post(req: Request, res: Response): void {
    if (req.body['single-or-multiple'] === 'single') {
      res.redirect('/');
    }
    else req.body['single-or-multiple'] === 'multiple' ?
      res.redirect(URLS.LEGACY_ET1):
      res.render('single-or-multiple-claim', {
        noRadioButtonSelectedError: true,
        ...req.t('common', { returnObjects: true }),
        ...req.t('single-or-multiple-claim', { returnObjects: true }),
      });
  }
}
