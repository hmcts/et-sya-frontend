import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getAllTseApplicationCollection } from './helpers/ApplicationDetailsHelper';
import { getPageContent } from './helpers/FormHelpers';
import { populateAppItemsWithRedirectLinksCaptionsAndStatusColors } from './helpers/PageContentHelpers';
import { updateStoredRedirectUrl } from './helpers/YourAppsToTheTribunalHelpers';

export default class YourAppsToTheTribunalController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const tseGenericApps = getAllTseApplicationCollection(userCase);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    };
    const welshEnabled = await getFlagValue('welsh-language', null);
    populateAppItemsWithRedirectLinksCaptionsAndStatusColors(tseGenericApps, req.url, translations);
    updateStoredRedirectUrl(tseGenericApps, req.url);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.YOUR_APPLICATIONS,
    ]);

    res.render(TranslationKeys.YOUR_APPLICATIONS, {
      ...content,
      tseGenericApps,
      translations,
      welshEnabled,
    });
  };
}
