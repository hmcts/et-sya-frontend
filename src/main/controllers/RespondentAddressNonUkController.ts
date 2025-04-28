import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent } from './helpers/FormHelpers';
import {
  fillRespondentAddressFieldsNonUK,
  getRespondentAddressContent,
  handlePost,
} from './helpers/RespondentAddressHelper';
import { getRespondentIndex } from './helpers/RespondentHelpers';

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
    const { userCase } = req.session;
    const { respondents } = userCase;
    const respondentIndex = getRespondentIndex(req);
    const selectedRespondent = respondents[respondentIndex];
    const content = getPageContent(
      req,
      this.respondentAddressContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS, TranslationKeys.ENTER_ADDRESS],
      respondentIndex
    );
    fillRespondentAddressFieldsNonUK(userCase, selectedRespondent);
    assignFormData(userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      respondentName: selectedRespondent.respondentName,
      previousPostcode: selectedRespondent.respondentAddressPostcode,
    });
  };
}
