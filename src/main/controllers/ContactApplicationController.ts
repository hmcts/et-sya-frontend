import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { handlePostLogic, handleUploadDocument } from './helpers/CaseHelpers';
import { getFiles } from './helpers/ContactApplicationHelper';
import { getContactApplicationError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ContactApplicationController');

export default class ContactApplicationController {
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
    },
    submit: {
      text: (l: AnyRecord): string => l.uploadFileButton,
      classes: 'govuk-button--secondary',
    },
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
    const userCase = req.session?.userCase;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_APPLICATION, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };
    const content = getPageContent(req, this.contactApplicationContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_APPLICATION,
    ]);
    this.contactApplicationContent.submit.disabled = userCase?.contactApplicationFile !== undefined;
    res.render(TranslationKeys.CONTACT_APPLICATION, {
      ...translations,
      PageUrls,
      userCase,
      InterceptPaths,
      hideContactUs: true,
      files: getFiles(userCase, translations),
      errors: req.session.errors,
      ...content,
    });
  };
}
