import { Request, Response } from 'express';

export default class OnboardingController {
  public get(req: Request, res: Response): void {
    res.render('onboarding', {
      ...(req.t('onboarding', { returnObjects: true })),
    });
  }
}
