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

const logger = getLogger('AcasMultipleController');

export default class AcasMultipleController {
  private readonly form: Form;
  private readonly acasFormContent: FormContent = {
    fields: {
      acasMultiple: {
        classes: 'govuk-radios--inline',
        id: 'acas-multiple',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            name: 'radio1',
            value: 'Yes',
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.no,
            name: 'radio2',
            value: 'No',
            attributes: { maxLength: 2 },
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
    this.form = new Form(<FormFields>this.acasFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.CLAIM_STEPS
      : PageUrls.VALID_ACAS_REASON;

    if (PageUrls.CLAIM_STEPS === redirectUrl) {
      await handleClaimStepsRedirect(req, res, this.form, redirectUrl, logger);
    } else {
      handlePostLogicPreLogin(req, res, this.form, redirectUrl);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ACAS_MULTIPLE_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_MULTIPLE_CLAIM, {
      ...content,
    });
  };
}
