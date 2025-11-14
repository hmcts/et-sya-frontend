import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import applications, { applicationTypes } from '../definitions/contact-applications';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { clearTseFields, handleUploadDocument } from './helpers/CaseHelpers';
import { ContactTheTribunalHelper } from './helpers/ContactTheTribunalHelper';
import { getFileErrorMessage, getFileUploadAndTextAreaError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage, setUrlLanguageFromSessionLanguage } from './helpers/LanguageHelper';
import { copyToOtherPartyRedirectUrl } from './helpers/LinkHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ContactTheTribunalSelectedController');

/**
 * Controller for any contact-the-tribunal application page
 */
export default class ContactTheTribunalSelectedController {
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (this.uploadedFileName && this.uploadedFileName !== '') {
      return (label.contactApplicationFile.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return '';
    }
  };

  private readonly form: Form;
  private readonly contactApplicationContent: FormContent = {
    fields: {
      contactApplicationText: {
        id: 'Contact-Application-Text',
        type: 'textarea',
        label: l => l.contactApplicationText,
        labelHidden: false,
      },
      contactApplicationFile: {
        type: 'upload',
        id: 'contactApplicationFile',
        classes: 'govuk-label',
        label: l => l.contactApplicationFile.title,
        hint: (l: AnyRecord) => this.getHint(l),
      },
      remove: {
        label: (l: AnyRecord): string => l.contactApplicationFile.removeButton,
        classes: 'govuk-button--secondary',
        type: 'button',
        id: 'remove',
        name: 'remove',
        value: 'true',
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.contactApplicationContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);

    userCase.contactApplicationText = req.body.contactApplicationText;

    const selectedOption = applications.find(appType => appType === req.params.selectedOption);
    if (!selectedOption) {
      logger.info('bad request parameter: "' + selectedOption + '"');
      res.redirect(ErrorPages.NOT_FOUND + languageParam);
      return;
    }

    if (req.body?.remove) {
      if (req.session?.userCase?.contactApplicationFile) {
        req.session.userCase.contactApplicationFile = undefined;
      }
      return res.redirect(
        PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', selectedOption) + languageParam
      );
    }

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    req.session.errors = [];
    const contactApplicationError = getFileUploadAndTextAreaError(
      formData.contactApplicationText,
      req.file,
      req.fileTooLarge,
      userCase.contactApplicationFile,
      'contactApplicationText',
      'contactApplicationFile',
      logger
    );

    if (contactApplicationError) {
      req.session.errors.push(contactApplicationError);
      return res.redirect(
        PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', selectedOption) + languageParam
      );
    }

    if (req.file) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          userCase.contactApplicationFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors.push({ propertyName: 'contactApplicationFile', errorType: 'backEndError' });
        return res.redirect(
          PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', selectedOption) + languageParam
        );
      }
    }
    req.session.errors = [];

    const redirectPage = applicationTypes.claimant.c.includes(userCase.contactApplicationType)
      ? PageUrls.CONTACT_THE_TRIBUNAL_CYA
      : copyToOtherPartyRedirectUrl(req.session.userCase);

    const redirectUrl = setUrlLanguageFromSessionLanguage(req, redirectPage);

    return res.redirect(redirectUrl);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);
    req.session.contactType = Rule92Types.CONTACT;
    const selectedApplication = req.params.selectedOption;
    if (!applications.includes(selectedApplication)) {
      logger.info('bad request parameter: "' + selectedApplication + '"');
      res.redirect(PageUrls.CONTACT_THE_TRIBUNAL + languageParam);
      return;
    }

    if (ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(req.session.userCase)) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const userCase = req.session?.userCase;
    if (selectedApplication !== userCase.contactApplicationType) {
      clearTseFields(userCase);
      userCase.contactApplicationType = selectedApplication;
    }

    this.uploadedFileName = userCase?.contactApplicationFile?.document_filename;

    const content = getPageContent(req, this.contactApplicationContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.TRIBUNAL_CONTACT_SELECTED,
      TranslationKeys.CONTACT_THE_TRIBUNAL + '-' + selectedApplication,
    ]);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, { returnObjects: true }),
    };

    res.render(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, {
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id)),
      errorMessage: getFileErrorMessage(req.session.errors, translations.errors.contactApplicationFile),
      ...content,
      welshEnabled,
    });
  };
}
