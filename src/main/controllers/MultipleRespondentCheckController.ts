import { Request, Response } from "express";

export default class MultipleRespondentCheckController {
    public get(req: Request, res: Response): void {
        res.render('multiple-respondent-check', {
            ...(req.t('multiple-respondent-check', { returnObjects: true }))
        });
    }

    public post(req: Request, res: Response): void {
        if (req.body['more-than-one-respondent'] === 'yes') {
            res.redirect('/');
        }
        else if (req.body['more-than-one-respondent'] === 'no') {
            res.redirect('/');
        } else {
            res.render('multiple-respondent-check', {
                noRadioButtonSelectedError: true,
                ...(req.t('multiple-respondent-check', { returnObjects: true })),
            });
        }
    }
}