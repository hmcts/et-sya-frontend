import { Request, Response } from 'express';

export default class ContactAcasController {
  public get(req: Request, res: Response): void {
    res.render('contact-acas', {
      ...req.t('common', { returnObjects: true }),
      ...(req.t('contact-acas', { returnObjects: true })),
    });
  }
}
