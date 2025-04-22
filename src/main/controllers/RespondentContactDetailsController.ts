import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getRespondentContactDetails } from './helpers/RespondentContactDetailsHelper';

/**
 * Controller for contact-the-tribunal page with a list of applications to start
 */
export default class RespondentContactDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    res.render(TranslationKeys.RESPONDENT_CONTACT_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_CONTACT_DETAILS as never, { returnObjects: true } as never),
      hideContactUs: true,
      contactDetailsList: getRespondentContactDetails(req),
      welshEnabled,
    });
  }
}
