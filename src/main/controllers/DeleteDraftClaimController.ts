import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';

export default class DeleteDraftClaimController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    res.render('delete-draft-claim', {
      caseReference: req.params.id,
      backToCaseUrl: `/claimant-application/${req.params.id}`,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // TODO: Add logic to delete the draft claim from the database or API
    res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
  };
}
