import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentLink,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { returnSessionErrors } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('StoredToSubmitController');

export default class StoredToSubmitController {
  private readonly form: Form;

  private readonly StoredToSubmitContent: FormContent = {
    fields: {
      confirmCopied: {
        id: 'confirmCopied',
        label: l => l.haveYouCopied,
        labelHidden: false,
        labelSize: 'm',
        type: 'checkboxes',
        hint: l => l.iConfirmThatIHaveCopied,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'confirmCopied',
            label: l => l.yesIConfirm,
            value: YesOrNo.YES,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.StoredToSubmitContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session?.userCase;

    const errors = returnSessionErrors(req, this.form);
    if (errors.length > 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }
    req.session.errors = [];

    try {
      userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.IN_PROGRESS;
      await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    try {
      await getCaseApi(req.session.user?.accessToken).storedToSubmitClaimantTse(req.session.userCase);
      userCase.selectedGenericTseApplication = undefined;
      userCase.confirmCopied = undefined;
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }

    return res.redirect(PageUrls.APPLICATION_COMPLETE + languageParam);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    if (selectedApplication === undefined) {
      logger.error('Selected application not found');
      return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
    }
    userCase.selectedGenericTseApplication = selectedApplication;

    const document = selectedApplication.value?.documentUpload;
    const accessToken = req.session.user?.accessToken;
    if (document) {
      try {
        await populateDocumentMetadata(document, accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect(`${ErrorPages.NOT_FOUND}${languageParam}`);
      }
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    const content = getPageContent(req, this.StoredToSubmitContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_TO_SUBMIT,
    ]);

    res.render(TranslationKeys.STORED_TO_SUBMIT, {
      ...content,
      applicationType: translations.applicationTo + translations[selectedApplication.value.type],
      appContent: getTseApplicationDetails(selectedApplication, translations, createDownloadLink(document)),
      viewCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      document,
      viewCorrespondenceFileLink: getDocumentLink(document),
      cancelLink: getCancelLink(req),
    });
  };
}