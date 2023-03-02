import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { handlePostLogic } from './helpers/CaseHelpers';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentAdditionalInformation,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getApplicationRespondByDate } from './helpers/PageContentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('RespondToApplicationController');

export default class RespondToApplicationController {
  private readonly form: Form;
  private readonly respondToApplicationContent: FormContent = {
    fields: {
      respondToApplicationText: {
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.RESPONDENT_APPLICATIONS);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPOND_TO_APPLICATION, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const selectedApplication = findSelectedGenericTseApplication(
      req.session.userCase.genericTseApplicationCollection,
      req.params.appId
    );

    req.session.userCase.selectedGenericTseApplication = selectedApplication;

    const applicationType = translations[selectedApplication.value.type];
    const respondByDate = getApplicationRespondByDate(selectedApplication, req, translations);
    const document = selectedApplication.value?.documentUpload;

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, req.session.user?.accessToken);
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
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink),
    });
  };
}
