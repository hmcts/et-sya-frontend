import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import {TranslationKeys} from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import {handlePostLogic, handleUploadDocument} from "./helpers/CaseHelpers";
import {fromApiFormatDocument} from "../helper/ApiFormatter";
import {getContactTemplateError} from "./helpers/ErrorHelpers";
import {getLogger} from "../logger";

const logger = getLogger('ContactTemplateController');


export default class ContactTemplateController {

  private getHint = (label: AnyRecord): string => {
    return label.fileUpload.hint;
  };
  // private getDisabled = (label: AnyRecord): string => {
  //   return label.fileUpload.hint;
  // };
  private readonly form: Form;
  private readonly contactTemplateContent: FormContent = {
    fields: {
      contactTemplateText: {
        id: 'Contact-Template-Text',
        type: 'textarea',
        label: l => l.legend,
        labelHidden: true,
        labelSize: 'normal',
        hint: l => l.contactTemplateText,
        attributes: {title: 'Give details text area'},
      },
      contactTemplateFile: {
        id: 'contactTemplateFile',
        classes: 'govuk-label',
        labelHidden: false,
        hint: l => this.getHint(l),
        labelSize: 'm',
        type: 'upload',
      },
      // uploadButton: {
      //   id: 'uploadButton',
      //   type: 'submit',
      //  // disabled: this.getDisabled(),
      //  // labelHidden: false,
      //   //hint: l => this.getHint(l),
      //   //labelSize: 'm',
      //   //type: 'upload',
      // },
    },
    // submit: {
    //   text: (l: AnyRecord): string => l.continue,
    //   classes: 'govuk-!-margin-right-8',
    // },
    //
    // cancel: {
    //   text: (l: AnyRecord): string => l.cancel,
    //   classes: 'govuk-link',
    //   link: "#",
    //   hidden: ""
    // },
  };

  constructor() {
    this.form = new Form(<FormFields>this.contactTemplateContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.fileTooLarge) {
      req.fileTooLarge = false;
      req.session.errors = [{propertyName: 'contactTemplateFile', errorType: 'invalidFileSize'}];
      return res.redirect(req.url);
    }
    req.session.errors = [];
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const contactTemplateError = getContactTemplateError(
      formData,
      req.file
    );
    if (!contactTemplateError) {
      try {
        const result = await handleUploadDocument(req, req.file, logger);
        if (result?.data) {
          req.session.userCase.contactTemplateFile = fromApiFormatDocument(result.data);
        }
      } catch (error) {
        logger.info(error);
        req.session.errors = [{propertyName: 'contactTemplateFile', errorType: 'backEndError'}];
      } finally {
        await handlePostLogic(req, res, this.form, logger, req.url);
      }
    } else {
      req.session.errors.push(contactTemplateError);
      return res.redirect(req.url);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.contactTemplateContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_TEMPLATE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CONTACT_TEMPLATE, {
      hideContactUs: true,
      ...content,
    });
  };
}
