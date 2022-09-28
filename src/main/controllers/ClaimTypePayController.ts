import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimTypePay } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class ClaimTypePayController {
  private readonly form: Form;
  private readonly claimTypePayFormContent: FormContent = {
    fields: {
      claimTypePay: {
        id: 'claimTypePay',
        label: l => l.h1,
        labelHidden: true,
        type: 'checkboxes',
        isPageHeading: true,
        hint: l => l.selectAllHint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'arrears',
            label: l => l.arrears.checkbox,
            value: ClaimTypePay.ARREARS,
          },
          {
            id: 'holidayPay',
            label: l => l.holidayPay.checkbox,
            value: ClaimTypePay.HOLIDAY_PAY,
          },
          {
            id: 'noticePay',
            label: l => l.noticePay.checkbox,
            value: ClaimTypePay.NOTICE_PAY,
          },
          {
            id: 'redundancyPay',
            label: l => l.redundancyPay.checkbox,
            value: ClaimTypePay.REDUNDANCY_PAY,
          },
          {
            id: 'otherPayments',
            label: l => l.otherPayments.checkbox,
            value: ClaimTypePay.OTHER_PAYMENTS,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.claimTypePayFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.DESCRIBE_WHAT_HAPPENED);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimTypePayFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIM_TYPE_PAY,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIM_TYPE_PAY, {
      ...content,
    });
  };
}
