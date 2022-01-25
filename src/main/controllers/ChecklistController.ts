import { Request, Response } from 'express';

export default class ChecklistController {
  public get(req: Request, res: Response): void {
    res.render('checklist', {
      ...(req.t('checklist', { returnObjects: true })),
    });
  }
}