import { Response } from 'express';

import { isDateInPast, isDateInputInvalid, isDateNotPartial } from '../components/form/date-validator';
import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DateValues, StartDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantEmploymentStartDateController');

const startDate: DateFormFields = {
  ...StartDateFormFields,
  id: 'startDate',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('startDate', body),
  validator: value => isDateNotPartial(value) || isDateInputInvalid(value) || isDateInPast(value),
};

export default class ClaimantEmploymentStartDateController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: { startDate },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.DID_CLAIMANT_HAVE_WRITTEN_CONTRACT);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_EMPLOYMENT_START_DATE);
  };
}
