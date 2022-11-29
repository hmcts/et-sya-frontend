import {Form} from "../components/form/form";
import {AppRequest} from "../definitions/appRequest";
import {Response} from "express";
import {assignFormData, getPageContent} from "./helpers/FormHelpers";
import {FormContent, FormFields} from "../definitions/form";
import {TranslationKeys} from "../definitions/constants";
import {AnyRecord} from "../definitions/util-types";

export default class ContactTemplateController {
  private readonly form: Form;
  private readonly contactTemplateControllerContent: FormContent = {
    fields: {
      giveDetails: {
        id: 'giveDetails',
        type: 'textarea',
        label: l => l.legend,
        labelHidden: true,
        labelSize: 'normal',
        hint: l => l.giveDetails,
        attributes: { title: 'Give details text area' },
      },
      fileUploaded: {
        id: 'file-upload',
        label: l => l.fileUpload.label,
        classes: 'govuk-label',
        labelHidden: false,
        labelSize: 'm',
        type: 'upload',
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-8',
    },

    saveForLater: {
      text: (l: AnyRecord): string => l.cancel,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.contactTemplateControllerContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.file)
      return res.redirect(req.url);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.contactTemplateControllerContent, [TranslationKeys.COMMON, TranslationKeys.CONTACT_TEMPLATE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CONTACT_TEMPLATE, {
      ...content,
    });
  };
}
