import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { FormContent, FormFields } from '../definitions/form';

import { getRespondentAddressContent, handleGet, handlePost } from './helpers/RespondentAddressHelper';

export default class RespondentAddressNonUkController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = getRespondentAddressContent(false);

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePost(req, res, this.form);
  };

  public get = (req: AppRequest, res: Response): void => {
    handleGet(req, res, this.form, this.respondentAddressContent);
  };
}
