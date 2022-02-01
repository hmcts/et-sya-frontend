import { Response } from 'express';
import { AppRequest } from '../definitions/appRequest';

export default class ContactAcasController {
  public get(req: AppRequest, res: Response): void {
    res.render('contact-acas', {
      ...req.t('common', { returnObjects: true }),
      ...(req.t('contact-acas', { returnObjects: true })),
    });
  }
}
