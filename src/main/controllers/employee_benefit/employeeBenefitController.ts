import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent } from '../helpers';

export default class employeeBenefitController {
  private readonly form: Form;

  constructor(private readonly employeeBenefitContent: FormContent) {
    this.form = new Form(<FormFields>this.employeeBenefitContent.fields);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.employeeBenefitContent, [
      TranslationKeys.COMMON,
      TranslationKeys.EMPLOYEE_BENEFITS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.EMPLOYEE_BENEFITS, {
      ...content,
    });
  };
}
