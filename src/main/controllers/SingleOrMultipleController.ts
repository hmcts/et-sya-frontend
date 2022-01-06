import { Request, Response } from 'express';

export default class SingleOrMultipleController {
  public get(req: Request, res: Response): void {
    res.render('single-or-multiple-claim', {
      ...(req.t('single-or-multiple-claim', { returnObjects: true })),
    });
  }
}
