import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class AddressDetailsController {
  private readonly form: Form;

  constructor(private readonly addressDetailsContent: FormContent) {
    this.form = new Form(<FormFields>this.addressDetailsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.TELEPHONE_NUMBER);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.addressDetailsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ADDRESS_DETAILS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADDRESS_DETAILS, {
      ...content,
    });
  };
}
