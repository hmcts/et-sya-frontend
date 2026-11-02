import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DateValues, EndDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantEndDateController');

const endDate: DateFormFields = {
  ...EndDateFormFields,
  id: 'end-date',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('endDate', body),
};

export default class ClaimantEndDateController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: { endDate },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_NOTICE_PERIOD);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.END_DATE);
  };
}
