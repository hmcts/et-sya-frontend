import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import applications, { typeCApplications } from '../definitions/contact-applications';
import { FormContent, FormError, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handleUploadDocument } from './helpers/CaseHelpers';
import { getFiles } from './helpers/ContactApplicationHelper';
import { getContactApplicationError, getLastFileError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

const logger = getLogger('ContactTheTribunalSelectedController');

/**
 * Controller for any contact-the-tribunal application page
 */
export default class ContactTheTribunalSelectedController {
  private readonly form: Form;
  private readonly contactApplicationContent: FormContent = {
    fields: {
      contactApplicationText: {
        id: 'Contact-Application-Text',
        type: 'textarea',
        label: l => l.legend,
        labelHidden: true,
        labelSize: 'normal',
        hint: l => l.contactApplicationText,
        attributes: { title: 'Give details text area' },
      },
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: l => l.files.title,
        type: 'insetFields',
        subFields: {
          contactApplicationFile: {
            id: 'contactApplicationFile',
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
    this.form = new Form(<FormFields>this.contactApplicationContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;

    // Todo think about using CaseHelpers.setUserCase
    userCase.contactApplicationText = req.body.contactApplicationText;

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    req.session.errors = [];
    const contactApplicationError = getContactApplicationError(
      formData,
      req.file,
      req.fileTooLarge,
      userCase.contactApplicationFile
    );
    if (contactApplicationError) {
      req.session.errors.push(contactApplicationError);
      //TODO Handle redirect to Welsh page
      return res.redirect(`${PageUrls.CONTACT_THE_TRIBUNAL}/${req.params.selectedOption}`);
    }

    if (req.body.upload) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          userCase.contactApplicationFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors.push({ propertyName: 'contactApplicationFile', errorType: 'backEndError' });
      }
      return res.redirect(`${PageUrls.CONTACT_THE_TRIBUNAL}/${req.params.selectedOption}`);
    }
    req.session.errors = [];

    const redirectPage = typeCApplications.includes(userCase.contactApplicationType)
      ? PageUrls.CONTACT_THE_TRIBUNAL_CYA
      : PageUrls.COPY_TO_OTHER_PARTY;

    return res.redirect(redirectPage);
  };

  public get = (req: AppRequest, res: Response): void => {
    req.session.contactType = 'Contact';
    const selectedApplication = req.params.selectedOption;
    if (!applications.includes(selectedApplication)) {
      logger.info('bad request parameter: "' + selectedApplication + '"');
      res.redirect(PageUrls.CONTACT_THE_TRIBUNAL);
      return;
    }

    const userCase = req.session?.userCase;
    if (selectedApplication !== userCase.contactApplicationType) {
      clearTseFields(userCase);
      userCase.contactApplicationType = selectedApplication;
    }

    const content = getPageContent(req, this.contactApplicationContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.TRIBUNAL_CONTACT_SELECTED,
      TranslationKeys.CONTACT_THE_TRIBUNAL + '-' + selectedApplication,
    ]);

    (this.contactApplicationContent.fields as any).inset.subFields.upload.disabled =
      userCase?.contactApplicationFile !== undefined;

    (this.contactApplicationContent.fields as any).filesUploaded.rows = getFiles(userCase, selectedApplication, {
      ...req.t(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, { returnObjects: true }),
    });

    const fileError: FormError = getLastFileError(req.session.errors);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, { returnObjects: true }),
    };

    let errorMessage: string;
    if (fileError) {
      const errorMessages = translations.errors.contactApplicationFile;
      errorMessage = errorMessages[fileError.errorType];
    } else {
      errorMessage = undefined;
    }

    res.render(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, {
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      cancelLink: setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id)),
      errorMessage,
      ...content,
    });
  };
}

export function clearTseFields(userCase: CaseWithId): void {
  userCase.contactApplicationText = undefined;
  userCase.contactApplicationFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
}
