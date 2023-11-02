import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import applications from '../definitions/contact-applications';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getPageContent } from './helpers/FormHelpers';
import { generateAccordionItems } from './helpers/PageContentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

/**
 * Controller for contact-the-tribunal page with a list of applications to start
 */
export default class ContactTheTribunalController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);
    const applicationsAccordionItems = generateAccordionItems(applications, translations, languageParam);
    const notifications = userCase?.sendNotificationCollection?.filter(
      it => it.value.sendNotificationCaseManagement === 'Request'
    );

    if (!notifications?.length) {
      applicationsAccordionItems.splice(applications.length - 1, 1);
    }

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL,
    ]);
    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL, {
      ...content,
      hideContactUs: true,
      applicationsAccordionItems,
      welshEnabled,
    });
  }
}
