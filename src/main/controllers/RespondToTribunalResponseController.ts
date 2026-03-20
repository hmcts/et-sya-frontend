import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, Rule92Types, ServiceErrors, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { SupportingMaterialYesNoRadioValues } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { datesStringToDateInLocale } from '../helper/dateInLocale';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getAllResponses, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { createDownloadLink, findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { handlePost } from './helpers/RespondToApplicationHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('RespondToTribunalResponseController');

export default class RespondToTribunalResponseController {
  private readonly form: Form;
  private readonly respondToApplicationContent: FormContent = {
    fields: {
      responseText: {
        id: 'respond-to-application-text',
        type: 'textarea',
        label: l => l.textInputLabel,
        labelHidden: false,
        labelSize: 'm',
        hint: l => l.textInputHint,
        attributes: { title: 'Response text area' },
        validator: isFieldFilledIn,
      },
      hasSupportingMaterial: {
        id: 'supporting-material-yes-no',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: l => l.radioButtonLabel,
        labelHidden: false,
        labelSize: 'm',
        hint: l => l.radioButtonHint,
        isPageHeading: true,
        values: SupportingMaterialYesNoRadioValues,
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: l => l.continue,
    },
  };
  constructor() {
    this.form = new Form(<FormFields>this.respondToApplicationContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePost(req, res, this.form, PageUrls.RESPOND_TO_TRIBUNAL_RESPONSE, logger);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    if (!selectedApplication) {
      logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }
    userCase.selectedGenericTseApplication = selectedApplication;
    req.session.contactType = Rule92Types.TRIBUNAL;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    let allResponses;
    try {
      allResponses = await getAllResponses(selectedApplication, translations, req);
    } catch (e) {
      logger.error(e.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const document = selectedApplication.value?.documentUpload;
    const downloadLink = createDownloadLink(document);
    const applicationDate = datesStringToDateInLocale(selectedApplication.value.date, req.url);

    const content = getPageContent(req, this.respondToApplicationContent, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE, {
      ...content,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink, applicationDate),
      allResponses,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id)),
      hideContactUs: true,
      welshEnabled,
    });
  };
}
