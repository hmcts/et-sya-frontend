import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { handleClaimStepsRedirect } from './helpers/RedirectHelpers';
import { conditionalRedirect } from './helpers/RouterHelpers';

const logger = getLogger('ValidNoAcasReasonController');

export default class ValidNoAcasReasonController {
  private readonly form: Form;
  private readonly validNoAcasReasonFormContent: FormContent = {
    fields: {
      validNoAcasReason: {
        classes: 'govuk-radios--inline',
        id: 'valid-no-acas-reason',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            name: 'radio1',
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            name: 'radio2',
            value: YesOrNo.NO,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.validNoAcasReasonFormContent.fields);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.validNoAcasReasonFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.VALID_ACAS_REASON,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.VALID_ACAS_REASON, {
      ...content,
    });
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.CLAIM_STEPS
      : PageUrls.CONTACT_ACAS;
    if (PageUrls.CLAIM_STEPS === redirectUrl) {
      await handleClaimStepsRedirect(req, res, this.form, redirectUrl, logger);
    } else {
      handlePostLogicPreLogin(req, res, this.form, redirectUrl);
    }
  };
}
