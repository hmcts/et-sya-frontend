import { Request, Response } from 'express';

export default class VideoHearingController {

  public get(req: Request, res: Response): void {
    res.render('video-hearing', {
      ...(req.t('video-hearing', { returnObjects: true })),
    });
  }

  public post(req: Request, res: Response): void {
    if (req.body['video-hearing'] === 'yes') {
      res.redirect('/');
    }
    else if (req.body['video-hearing'] === 'no') { 
      res.redirect('/');
    } else {
      res.render('video-hearing', {
        noRadioButtonSelectedError: true,
        ...(req.t('video-hearing', { returnObjects: true })),
      });
    }
  }
}
