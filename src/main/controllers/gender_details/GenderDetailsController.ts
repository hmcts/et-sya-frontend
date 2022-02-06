import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';

export default class GenderDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    const sessionErrors = req.session?.errors || [];
    const userCase = req.session?.userCase;

    res.render('gender-details', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('gender-details', { returnObjects: true }),
      sessionErrors,
      userCase,
    });
  };
}
