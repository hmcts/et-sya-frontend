import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimTypePay } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ClaimTypePayController');

export default class ClaimTypePayController {
  private readonly form: Form;
  private readonly claimTypePayFormContent: FormContent = {
    fields: {
      claimTypePay: {
        id: 'claimTypePay',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
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

  constructor() {
    this.form = new Form(<FormFields>this.claimTypePayFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.DESCRIBE_WHAT_HAPPENED);
  };

  @CaseStateCheck()
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
