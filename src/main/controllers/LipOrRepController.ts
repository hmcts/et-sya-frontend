import { Request, Response } from 'express';

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
      // redirect to legacy ET1 service
      const URL = 'https://employmenttribunals.service.gov.uk/apply';
      res.redirect(URL);
    } else {
      const errorMessage = 'Select if you are representing yourself or if you are a representative making a claim for someone else.';
      res.render('lip-or-representative', {
        errorMessage,
        ...(req.t('lip-or-representative', { returnObjects: true })),
      });
    }
  }
}
