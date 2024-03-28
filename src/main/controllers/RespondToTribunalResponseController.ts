import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { SupportingMaterialYesNoRadioValues } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getAllResponses, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { setUserCase } from './helpers/CaseHelpers';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { getResponseErrors as getApplicationResponseError } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { copyToOtherPartyRedirectUrl } from './helpers/LinkHelpers';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

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
    setUserCase(req, this.form);
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const error = getApplicationResponseError(formData);
    const languageParam = getLanguageParam(req.url);

    if (error) {
      req.session.errors = [];
      req.session.errors.push(error);
      const pageUrl = `/${TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE}/${req.params.appId}${languageParam}`;
      return res.redirect(returnSafeRedirectUrl(req, pageUrl, logger));
    }
    req.session.errors = [];
    const redirectUrl =
      req.session.userCase.hasSupportingMaterial === YesOrNo.YES
        ? PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.appId) + languageParam
        : copyToOtherPartyRedirectUrl(req.session.userCase) + languageParam;

    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
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
    if (document) {
      try {
        await populateDocumentMetadata(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect(ErrorPages.NOT_FOUND);
      }
    }
    const downloadLink = createDownloadLink(document);

    const content = getPageContent(req, this.respondToApplicationContent, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE, {
      ...content,
      appContent: getTseApplicationDetails(
        selectedApplication,
        translations,
        downloadLink,
        retrieveCurrentLocale(req.url)
      ),
      allResponses,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id)),
      hideContactUs: true,
      welshEnabled,
    });
  };
}
