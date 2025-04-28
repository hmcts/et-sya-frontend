import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { FormContent, FormFields } from '../definitions/form';

import {
  fillRespondentAddressFieldsNonUK,
  getRespondentAddressContent,
  handleGet,
  handlePost,
} from './helpers/RespondentAddressHelper';

export default class RespondentAddressNonUkController {
  private readonly form: Form;
  private readonly formContent: FormContent = getRespondentAddressContent(false);

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePost(req, res, this.form);
  };

  public get = (req: AppRequest, res: Response): void => {
    fillRespondentAddressFieldsNonUK(req);
    handleGet(req, res, this.form, this.formContent);
  };
}
