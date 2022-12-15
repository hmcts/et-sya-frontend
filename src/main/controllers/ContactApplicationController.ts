import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import {InterceptPaths, PageUrls, TranslationKeys} from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import {handlePostLogic, handleUploadDocument} from "./helpers/CaseHelpers";
import {fromApiFormatDocument} from "../helper/ApiFormatter";
import {getContactApplicationError} from "./helpers/ErrorHelpers";
import {getLogger} from "../logger";
import {getFiles} from "./helpers/ContactApplicationHelper";
import {getPageContent} from "./helpers/FormHelpers";
import {Document} from "../definitions/case";


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
        attributes: {title: 'Give details text area'},
      },
      contactApplicationFile: {
        id: 'contactApplicationFile',
        label: l => l.fileUpload.label,
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        hint: l => this.getHint(l),
      },
      contactApplicationFileType: {
        id: 'contactApplicationFileType',
        label: l => l.acceptedFormats.label,
        labelHidden: true,
        type: 'readonly',
        classes: 'govuk-label',
        isCollapsable: true,
        collapsableTitle: l => l.acceptedFormats.label,
        hint: l => l.acceptedFormats.p1,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.uploadFileButton,
      classes: "govuk-button--secondary"
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.contactApplicationContent.fields);
  }



  private static getFile(document: Express.Multer.File): Document {
    return {
      document_url: "",
      document_filename: document.originalname,
      document_binary_url: "",
    };
  }


  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.fileTooLarge) {
      req.fileTooLarge = false;
      req.session.errors = [{propertyName: 'contactApplicationFile', errorType: 'invalidFileSize'}];
      return res.redirect(PageUrls.CONTACT_APPLICATION);
    }
    req.session.errors = [];
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());


    const contactApplicationError = getContactApplicationError(
      formData,
      req.file
    );
    if (!contactApplicationError) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        req.session.userCase.contactApplicationFile = ContactApplicationController.getFile(req.file);

        if (result?.data) {
          req.session.userCase.contactApplicationFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors = [{propertyName: 'contactApplicationFile', errorType: 'backEndError'}];
      } finally {
        await handlePostLogic(req, res, this.form, logger, req.url);
      }
    } else {
      req.session.errors.push(contactApplicationError);
      return res.redirect(PageUrls.CONTACT_APPLICATION);

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
