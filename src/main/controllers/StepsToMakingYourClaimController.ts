import { Request, Response } from 'express';

export default class StepsToMakingYourClaimController {
  public get(req: Request, res: Response): void {
    res.render('steps-to-making-your-claim', {
      ...(req.t('steps-to-making-your-claim', { returnObjects: true })),
    });
  }
}
