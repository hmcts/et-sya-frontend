import { Request, Response } from 'express';

export default class VideoHearingController {

  public get(req: Request, res: Response): void {
    res.render('video-hearing', {
      ...(req.t('video-hearing', { returnObjects: true })),
    });
  }

  public post(req: Request, res: Response): void {    
    if (req.body['video-hearing'] === 'yes' &&  req.body.saveAndContinue === 'saveAndContinue') {
      res.redirect('/steps-to-making-your-claim');
    }
    else if (req.body['video-hearing'] === 'no' && req.body.saveAndContinue === 'saveAndContinue') {
      res.redirect('/steps-to-making-your-claim');
    }
    else if (req.body['video-hearing'] === 'yes' && req.body.saveForLater === 'saveForLater') { 
      res.redirect('/your-claim-has-been-saved');
    }
    else if (req.body['video-hearing'] === 'no' && req.body.saveForLater === 'saveForLater') { 
      res.redirect('/your-claim-has-been-saved');
    }
    else if ( req.body.saveForLater == 'saveForLater') { 
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
