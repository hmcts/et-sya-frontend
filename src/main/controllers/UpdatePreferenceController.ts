import { Request, Response } from 'express';

export default class UpdatePreferenceController {

  public get(req: Request, res: Response): void {
    res.render('update-preference', {
      ...req.t('common', { returnObjects: true }),
      ...(req.t('update-preference', { returnObjects: true })),
    });
  }

  public post(req: Request, res: Response): void {

    if (req.body.saveButton === 'saveForLater') return res.redirect('/your-claim-has-been-saved');

    req.body['update-preference'] ? res.redirect('/would-you-want-to-take-part-in-video-hearings') :
      res.render('update-preference', {
        noRadioButtonSelectedError: true,
        ...req.t('common', { returnObjects: true }),
        ...(req.t('update-preference', { returnObjects: true })),
      });
  }
}