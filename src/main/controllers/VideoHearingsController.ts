import { Request, Response } from 'express';

export default class VideoHearingsController {
  public get(req: Request, res: Response): void {
    res.render('video-hearings', {
      ...(req.t('video-hearings', { returnObjects: true })),
    });
  }
}