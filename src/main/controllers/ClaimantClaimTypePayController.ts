import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimTypePay } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantClaimTypePayController');

export default class ClaimantClaimTypePayController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimTypePay: {
        id: 'claimTypePay',
        type: 'checkboxes',
        label: (l: AnyRecord): string => l.h1,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        hint: (l: AnyRecord): string => l.selectAllHint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'arrears',
            name: 'claimTypePay',
            label: (l: AnyRecord): string => l.arrears,
            hint: (l: AnyRecord): string => l.arrearsHint,
            value: ClaimTypePay.ARREARS,
          },
          {
            id: 'holidayPay',
            name: 'claimTypePay',
            label: (l: AnyRecord): string => l.holidayPay,
            value: ClaimTypePay.HOLIDAY_PAY,
          },
          {
            id: 'noticePay',
            name: 'claimTypePay',
            label: (l: AnyRecord): string => l.noticePay,
            value: ClaimTypePay.NOTICE_PAY,
          },
          {
            id: 'redundancyPay',
            name: 'claimTypePay',
            label: (l: AnyRecord): string => l.redundancyPay,
            value: ClaimTypePay.REDUNDANCY_PAY,
          },
          {
            id: 'otherPayments',
            name: 'claimTypePay',
            label: (l: AnyRecord): string => l.otherPayments,
            value: ClaimTypePay.OTHER_PAYMENTS,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_CLAIM_TYPE_PAY);
  };
}
