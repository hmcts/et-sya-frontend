import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { checkCaseStateAndRedirect } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import {
  fillRespondentAddressFieldsNonUK,
  getRespondentAddressContent,
  handlePost,
} from './helpers/RespondentAddressHelper';
import { getRespondentIndex } from './helpers/RespondentHelpers';

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
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    const { userCase } = req.session;
    const respondentIndex = getRespondentIndex(req);
    const selectedRespondent = userCase.respondents[respondentIndex];
    const content = getPageContent(
      req,
      this.formContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS, TranslationKeys.ENTER_ADDRESS],
      respondentIndex
    );
    fillRespondentAddressFieldsNonUK(req.session.userCase, selectedRespondent);
    assignFormData(userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      respondentName: selectedRespondent.respondentName,
    });
  };
}
