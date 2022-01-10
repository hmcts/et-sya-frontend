import { Request, Response } from 'express';

export default class VideoHearingController {

  public get(req: Request, res: Response): void {
    res.render('video-hearing', {
      ...(req.t('video-hearing', { returnObjects: true })),
    });
  }

  public post(req: Request, res: Response): void {    
    if (req.body['video-hearing'] === 'yes' &&  req.body.saveButton === 'saveContinue') {
      res.redirect('/steps-to-making-your-claim');
    }
    else if (req.body['video-hearing'] === 'no' && req.body.saveButton === 'saveContinue') {
      res.redirect('/steps-to-making-your-claim');
    }
    else if (req.body['video-hearing'] === 'yes' && req.body.saveButton === 'saveForLater') { 
      res.redirect('/your-claim-has-been-saved');
    }
    else if (req.body['video-hearing'] === 'no' && req.body.saveButton === 'saveForLater') { 
      res.redirect('/your-claim-has-been-saved');
    }
    else if ( req.body.saveButton == 'saveForLater') { 
      res.redirect('/your-claim-has-been-saved');
    }
    else {
      res.render('video-hearing', {
        noRadioButtonSelectedError: true,
        ...(req.t('video-hearing', { returnObjects: true })),
      });
    }
  }
}
