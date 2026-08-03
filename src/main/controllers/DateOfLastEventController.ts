import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DateOfLastEventFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const date_of_last_event: DateFormFields = {
  ...DateOfLastEventFormFields,
  id: 'dateOfLastEvent',
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('dateOfLastEvent', body),
};

const logger = getLogger('DateOfLastEventController');

export default class DateOfLastEventController {
  private readonly form: Form;
  private readonly dateOfLastEventFormContent: FormContent = {
    fields: { dateOfLastEvent: date_of_last_event },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.dateOfLastEventFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.DESCRIBE_WHAT_HAPPENED);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    date_of_last_event.values = [
      {
        label: (l: AnyRecord): string => l.dateFormat.day,
        name: 'day',
        classes: 'govuk-input--width-2',
        attributes: { maxLength: 2 },
      },
      {
        label: (l: AnyRecord): string => l.dateFormat.month,
        name: 'month',
        classes: 'govuk-input--width-2',
        attributes: { maxLength: 2 },
      },
      {
        label: (l: AnyRecord): string => l.dateFormat.year,
        name: 'year',
        classes: 'govuk-input--width-4',
        attributes: { maxLength: 4 },
      },
    ];
    this.dateOfLastEventFormContent.fields = { dateOfLastEvent: date_of_last_event };
    const content = getPageContent(req, this.dateOfLastEventFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.DATE_OF_LAST_EVENT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DATE_OF_LAST_EVENT, {
      ...content,
    });
  };
}
