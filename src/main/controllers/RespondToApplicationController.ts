import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { SupportingMaterialYesNoRadioValues } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { datesStringToDateInLocale } from '../helper/dateInLocale';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { setUserCase } from './helpers/CaseHelpers';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { getResponseErrors as getApplicationResponseError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getApplicationRespondByDate } from './helpers/PageContentHelpers';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('RespondToApplicationController');

export default class RespondToApplicationController {
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
    const languageParam = getLanguageParam(req.url);
    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.params.appId
    );
    if (selectedApplication === undefined) {
      logger.error('Selected application not found');
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const error = getApplicationResponseError(formData);

    if (error) {
      req.session.errors = [];
      req.session.errors.push(error);
      const redirectUrl =
        PageUrls.RESPOND_TO_APPLICATION_SELECTED.replace(':appId', selectedApplication.id) + languageParam;
      return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
    }
    req.session.errors = [];
    const redirectUrl =
      req.session.userCase.hasSupportingMaterial === YesOrNo.YES
        ? PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', selectedApplication.id) + languageParam
        : PageUrls.COPY_TO_OTHER_PARTY + languageParam;
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    req.session.contactType = Rule92Types.RESPOND;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPOND_TO_APPLICATION, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const selectedApplication = req.session.userCase.selectedGenericTseApplication;

    const applicationType = translations[selectedApplication.value.type];
    const respondByDate = getApplicationRespondByDate(selectedApplication, translations);
    const applicationDate = datesStringToDateInLocale(selectedApplication.value.date, req.url);
    const applicant = translations[selectedApplication.value.applicant];
    const document = selectedApplication.value?.documentUpload;

    if (document) {
      try {
        await populateDocumentMetadata(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }
    const downloadLink = createDownloadLink(document);

    const content = getPageContent(req, this.respondToApplicationContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPOND_TO_APPLICATION,
    ]);

    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;
    res.render(TranslationKeys.RESPOND_TO_APPLICATION, {
      cancelLink: redirectUrl,
      ...content,
      applicationType,
      respondByDate,
      selectedApplication,
      applicantType: applicant,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink, applicationDate),
      welshEnabled,
    });
  };
}
