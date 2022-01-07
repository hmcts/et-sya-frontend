import { Request, Response } from 'express';

export default class UpdatePreferenceController {

    public get(req: Request, res: Response): void {
        res.render('update-preference', {
            ...(req.t('update-preference', { returnObjects: true })),
        });
    }

    public post(req: Request, res: Response): void {
        if (req.body['update-preference'] === 'email' && req.body['saveButton'] === 'saveContinue') {
            res.redirect('/would-you-want-to-take-part-in-video-hearings');
        }
        else if (req.body['update-preference'] === 'post' && req.body['saveButton'] === 'saveContinue') {
            res.redirect('/would-you-want-to-take-part-in-video-hearings');
        }
        else if (req.body['update-preference'] === 'email' && req.body['saveButton'] === 'saveForLater') {
            res.redirect('/your-claim-has-been-saved');
        }
        else if (req.body['update-preference'] === 'post' && req.body['saveButton'] === 'saveForLater') {
            res.redirect('/your-claim-has-been-saved');
        } else {
            res.render('update-preference', {
                noRadioButtonSelectedError: true,
                ...(req.t('update-preference', { returnObjects: true })),
            });
        }
    }
}