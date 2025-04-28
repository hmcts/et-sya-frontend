import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { FormContent, FormFields } from '../definitions/form';

import { getRespondentAddressContent, handleGet, handlePost } from './helpers/RespondentAddressHelper';
import { fillRespondentAddressFields } from './helpers/RespondentHelpers';

export default class RespondentAddressController {
  private readonly form: Form;
  private readonly formContent: FormContent = getRespondentAddressContent(true);

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePost(req, res, this.form);
  };

  public get = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;
    if (userCase.respondentAddressTypes !== undefined) {
      fillRespondentAddressFields(userCase.respondentAddressTypes, userCase);
    }
    handleGet(req, res, this.form, this.formContent);
  };
}
