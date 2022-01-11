import { Request, Response } from 'express';

export default class VideoHearingsController {
  public get(req: Request, res: Response): void {
    res.render('disability', {
      ...(req.t('disability', { returnObjects: true })),
    });
  }
}