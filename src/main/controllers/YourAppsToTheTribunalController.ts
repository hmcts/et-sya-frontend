import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers/FormHelpers';
import { populateAppItemsWithRedirectLinksCaptionsAndStatusColors } from './helpers/PageContentHelpers';

export default class YourAppsToTheTribunalController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const tseGenericApps = userCase.genericTseApplicationCollection;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    populateAppItemsWithRedirectLinksCaptionsAndStatusColors(tseGenericApps, req.url, translations);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.YOUR_APPLICATIONS,
    ]);

    res.render(TranslationKeys.YOUR_APPLICATIONS, {
      ...content,
      tseGenericApps,
      translations,
    });
  };
}
