import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors } from './helpers';

export default class WorkAddressController {
  private readonly form: Form;
  private readonly workAddressFormContent: FormContent = {
    fields: {
      sameWorkAddress: {
        ...DefaultRadioFormFields,
        id: 'work-address',
        classes: 'govuk-radios--inline',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.workAddressFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.ACAS_CERT_NUM
      : PageUrls.PLACE_OF_WORK;
    // TODO: Change to the correct redirect urls
    // TODO If Yes is selected then set work address = respondent address
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.workAddressFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WORK_ADDRESS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_ADDRESS, {
      ...content,
    });
  };
}
