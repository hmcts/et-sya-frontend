import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import applications from '../definitions/contact-applications';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handlePostLogic, handleUploadDocument } from './helpers/CaseHelpers';
import { getFiles } from './helpers/ContactApplicationHelper';
import { getContactApplicationError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ContactTheTribunalSelectedController');

/**
 * Controller for any contact-the-tribunal application page
 */
export default class ContactTheTribunalSelectedController {
  private getHint = (label: AnyRecord): string => {
    return label.fileUpload.hint;
  };
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
      contactApplicationFile: {
        id: 'contactApplicationFile',
        classes: 'govuk-label',
        labelHidden: false,
        hint: l => this.getHint(l),
        labelSize: 'm',
        type: 'upload',
      },
      upload: {
        id: 'upload',
        type: 'button',
      },
    },
    upload: {
      text: (l: AnyRecord): string => l.upload,
      classes: 'govuk-button--secondary',
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.contactApplicationContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.fileTooLarge) {
      req.fileTooLarge = false;
      req.session.errors = [{ propertyName: 'contactApplicationFile', errorType: 'invalidFileSize' }];
      return res.redirect(req.url);
    }
    req.session.errors = [];
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const contactApplicationError = getContactApplicationError(formData, req.file);
    if (!contactApplicationError) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          req.session.userCase.contactApplicationFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors = [{ propertyName: 'contactApplicationFile', errorType: 'backEndError' }];
      } finally {
        await handlePostLogic(req, res, this.form, logger, req.url);
      }
    } else {
      req.session.errors.push(contactApplicationError);
      return res.redirect(req.url);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const selectedApplication = req.params.selectedOption;
    if (!applications.includes(selectedApplication)) {
      logger.info('bad request parameter: "' + selectedApplication + '"');
      res.redirect(PageUrls.CONTACT_THE_TRIBUNAL);
      return;
    }

    const userCase = req.session?.userCase;
    const content = getPageContent(req, this.contactApplicationContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.TRIBUNAL_CONTACT_SELECTED,
      TranslationKeys.CONTACT_THE_TRIBUNAL + '-' + selectedApplication,
    ]);
    //this.contactApplicationContent.submit.disabled = userCase?.contactApplicationFile !== undefined;
    res.render(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, {
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      files: getFiles(userCase, selectedApplication, {
        ...req.t(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, { returnObjects: true }),
      }),
      errors: req.session.errors,
      ...content,
    });
  };
}
