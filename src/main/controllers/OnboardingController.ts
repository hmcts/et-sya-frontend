import { Request, Response } from 'express';

export default class OnboardingController {
  public get(req: Request, res: Response): void {
    res.render('onboarding.njk', {
      ...(req.i18n.getDataByLanguage(req.language).translation.onboarding as {}),
    });
  }
}
