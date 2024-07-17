import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getPageContent } from './helpers/FormHelpers';
import { getHearingDetails } from './helpers/HearingHelpers';

export default class HearingDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [TranslationKeys.COMMON]);

    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.HEARING_DETAILS, {
      ...content,
      hearingContent: getHearingDetails(userCase.hearingCollection, translations),
      welshEnabled,
    });
  };
}
