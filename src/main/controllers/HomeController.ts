import { Request, Response } from 'express';

export default class HomeController {
  public get(req: Request, res: Response): void {
    res.render('home');
  }
}
