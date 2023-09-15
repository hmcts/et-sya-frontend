import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { handlePostLogic } from './helpers/CaseHelpers';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentLink,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/Rule92NotSystemUserHelper';

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
    await handlePostLogic(req, res, this.form, logger, InterceptPaths.STORED_TO_SUBMIT_UPDATE);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    userCase.selectedGenericTseApplication = selectedApplication;

    const document = selectedApplication?.value?.documentUpload;
    const accessToken = req.session.user?.accessToken;
    if (document) {
      try {
        await populateDocumentMetadata(document, accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
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

    assignFormData(req.session.userCase, this.form.getFormFields());

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
