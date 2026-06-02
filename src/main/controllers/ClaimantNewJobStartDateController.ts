import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DateValues, NewJobDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { clearFields, handleClearSelection, renderPage } from './helpers/NonHmctsControllerHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantNewJobStartDateController');

const newJobStartDate: DateFormFields = {
  ...NewJobDateFormFields,
  id: 'new-job-start-date',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('newJobStartDate', body),
};

export default class ClaimantNewJobStartDateController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: { newJobStartDate },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_NEW_JOB_PAY);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'newJobStartDate'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_NEW_JOB_START_DATE, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
