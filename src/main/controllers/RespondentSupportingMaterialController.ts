import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import {
  ErrorPages,
  InterceptPaths,
  NoticeOfECC,
  NotificationSubjects,
  PageUrls,
  Rule92Types,
  TranslationKeys,
} from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { handleUploadDocument } from './helpers/CaseHelpers';
import { getFileErrorMessage, getFileUploadAndTextAreaError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage, setUrlLanguageFromSessionLanguage } from './helpers/LanguageHelper';
import { copyToOtherPartyRedirectUrl } from './helpers/LinkHelpers';
import { findSelectedParamId, getFilesRows } from './helpers/RespondentSupportingMaterialHelper';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';

const logger = getLogger('RespondentSupportingMaterialController');

export default class RespondentSupportingMaterialController {
  private readonly form: Form;
  private readonly supportingMaterialContent: FormContent = {
    fields: {
      responseText: {
        id: 'respond-to-application-text',
        type: 'textarea',
        label: l => l.legend,
        labelHidden: true,
        labelSize: 'normal',
        hint: l => l.responseText,
        attributes: { title: 'Give details text area' },
      },
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: l => l.files.title,
        type: 'insetFields',
        subFields: {
          supportingMaterialFile: {
            id: 'supportingMaterialFile',
            classes: 'govuk-label',
            labelHidden: false,
            labelSize: 'm',
            type: 'upload',
          },
          upload: {
            label: (l: AnyRecord): string => l.files.button,
            classes: 'govuk-button--secondary',
            id: 'upload',
            type: 'button',
            name: 'upload',
            value: 'true',
          },
        },
      },
      filesUploaded: {
        label: l => l.files.uploaded,
        type: 'summaryList',
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.supportingMaterialContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    userCase.responseText = req.body.responseText;

    const selectedParamId = findSelectedParamId(req.session.userCase, req.params.appId);
    if (selectedParamId === undefined) {
      logger.error('Selected param id not found');
      return res.redirect(setUrlLanguageFromSessionLanguage(req, ErrorPages.NOT_FOUND));
    }

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());

    req.session.errors = [];

    const supportingMaterialError = getFileUploadAndTextAreaError(
      formData.responseText,
      req.file,
      req.fileTooLarge,
      userCase.supportingMaterialFile,
      'responseText',
      'supportingMaterialFile',
      logger
    );

    const baseUrl = PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', selectedParamId);
    const supportingMaterialUrl = setUrlLanguageFromSessionLanguage(req, baseUrl);
    const selectedRequestOrOrder = userCase.selectedRequestOrOrder;
    const notificationSubject = selectedRequestOrOrder?.value?.sendNotificationSubject;

    if (supportingMaterialError) {
      req.session.errors.push(supportingMaterialError);
      return res.redirect(returnSafeRedirectUrl(req, supportingMaterialUrl, logger));
    }

    if (req.body.upload) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          userCase.supportingMaterialFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors.push({ propertyName: 'supportingMaterialFile', errorType: 'backEndError' });
      }
      return res.redirect(returnSafeRedirectUrl(req, supportingMaterialUrl, logger));
    }
    req.session.errors = [];

    if (
      req.session.contactType === Rule92Types.TRIBUNAL &&
      selectedRequestOrOrder &&
      notificationSubject?.length &&
      (notificationSubject.includes(NotificationSubjects.ECC) ||
        (notificationSubject.includes(NotificationSubjects.ORDER_OR_REQUEST) &&
          selectedRequestOrOrder.value.sendNotificationEccQuestion &&
          selectedRequestOrOrder.value.sendNotificationEccQuestion.includes(NoticeOfECC)))
    ) {
      return res.redirect(setUrlLanguageFromSessionLanguage(req, PageUrls.TRIBUNAL_RESPONSE_CYA));
    }
    return res.redirect(setUrlLanguageFromSessionLanguage(req, copyToOtherPartyRedirectUrl(req.session.userCase)));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const content = getPageContent(req, this.supportingMaterialContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL,
    ]);

    (this.supportingMaterialContent.fields as any).inset.subFields.upload.disabled =
      userCase?.supportingMaterialFile !== undefined;

    (this.supportingMaterialContent.fields as any).filesUploaded.rows = getFilesRows(
      languageParam,
      userCase,
      req.params.appId,
      {
        ...req.t(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, { returnObjects: true }),
      }
    );

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, { returnObjects: true }),
    };

    const hintTextToAnApplication = req.session.contactType === Rule92Types.RESPOND;
    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, {
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id)),
      errorMessage: getFileErrorMessage(req.session.errors, translations.errors.supportingMaterialFile),
      ...content,
      hintTextToAnApplication,
      welshEnabled,
    });
  };
}
