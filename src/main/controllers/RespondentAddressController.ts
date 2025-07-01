import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { checkCaseStateAndRedirect } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentAddressContent, handlePost } from './helpers/RespondentAddressHelper';
import { fillRespondentAddressFields, getRespondentIndex } from './helpers/RespondentHelpers';

export default class RespondentAddressController {
  private readonly form: Form;
  private readonly respondentAddressContent: FormContent = getRespondentAddressContent(true);

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePost(req, res, this.form);
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    const respondents = req.session.userCase.respondents;
    const x = req.session.userCase.respondentAddressTypes;
    const respondentIndex = getRespondentIndex(req);
    const selectedRespondent = respondents[respondentIndex];
    const content = getPageContent(
      req,
      this.respondentAddressContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_ADDRESS, TranslationKeys.ENTER_ADDRESS],
      respondentIndex
    );
    if (x !== undefined) {
      fillRespondentAddressFields(x, req.session.userCase);
    }
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      respondentName: selectedRespondent.respondentName,
      previousPostcode: selectedRespondent.respondentAddressPostcode,
    });
  };
}
