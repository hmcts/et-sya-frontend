import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { setUserCase } from './helpers/CaseHelpers';
import { createDownloadLink, populateDocumentMetadata } from './helpers/DocumentHelpers';
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
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
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

    if (error) {
      req.session.errors = [];
      req.session.errors.push(error);
      const redirectUrl = `${PageUrls.RESPOND_TO_APPLICATION}/${req.params.appId}${getLanguageParam(req.url)}`;
      return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
    }
    req.session.errors = [];
    const redirectUrl =
      req.session.userCase.hasSupportingMaterial === YesOrNo.YES
        ? PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.appId) + getLanguageParam(req.url)
        : PageUrls.COPY_TO_OTHER_PARTY + getLanguageParam(req.url);
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
      applicantType: selectedApplication.value.applicant,
      appContent: getTseApplicationDetails(
        selectedApplication,
        translations,
        downloadLink,
        retrieveCurrentLocale(req.url)
      ),
      welshEnabled,
    });
  };
}
