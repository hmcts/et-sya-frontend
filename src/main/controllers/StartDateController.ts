import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate, CaseWithId, StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, StartDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { isReturnUrlIsCheckAnswers } from './helpers/RouterHelpers';

const start_date: DateFormFields = {
  ...StartDateFormFields,
  id: 'startDate',
  hint: (l: AnyRecord): string => l.hint,
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('startDate', body),
};

const logger = getLogger('StartDateController');

export default class StartDateController {
  private readonly form: Form;
  private readonly startDateContent: FormContent = {
    fields: { startDate: start_date },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.startDateContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl = '';
    const stillWorking = req.session.userCase.isStillWorking;
    if (stillWorking === StillWorking.WORKING) {
      redirectUrl = PageUrls.NOTICE_PERIOD;
    } else if (stillWorking === StillWorking.NOTICE) {
      redirectUrl = PageUrls.NOTICE_END;
    } else if (stillWorking === StillWorking.NO_LONGER_WORKING) {
      redirectUrl = PageUrls.END_DATE;
    }

    if (isReturnUrlIsCheckAnswers(req)) {
      const shouldRedirect = isShouldRedirect(req.session.userCase, redirectUrl);
      return handlePostLogic(req, res, this.form, logger, redirectUrl, shouldRedirect);
    }

    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    start_date.values = [
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
    this.startDateContent.fields = { startDate: start_date };
    const content = getPageContent(req, this.startDateContent, [TranslationKeys.COMMON, TranslationKeys.START_DATE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.START_DATE, {
      ...content,
    });
  };
}

const isShouldRedirect = (userCase: CaseWithId, redirectUrl: string): boolean => {
  const { noticeEnds, endDate } = userCase;
  return (
    (redirectUrl === PageUrls.NOTICE_END && noticeEnds === undefined) ||
    (redirectUrl === PageUrls.END_DATE && endDate === undefined)
  );
};
