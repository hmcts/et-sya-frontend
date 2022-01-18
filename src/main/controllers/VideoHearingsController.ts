import { Request, Response } from 'express';

export default class VideoHearingController {

  public get(req: Request, res: Response): void {
    res.render('video-hearings', {
      ...(req.t('video-hearings', { returnObjects: true })),
    });
  }

  public post(req: Request, res: Response): void {

    if (req.body.saveButton === 'saveForLater') return res.redirect('/your-claim-has-been-saved');

    // if answer is supplied move on to next page, otherwise re-render with error
    req.body['video-hearing'] ? res.redirect('/steps-to-making-your-claim') :
      res.render('video-hearings', {
        noRadioButtonSelectedError: true,
        ...(req.t('video-hearings', { returnObjects: true })),
      })
  }


}
