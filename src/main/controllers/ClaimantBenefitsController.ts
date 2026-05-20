import { Response } from 'express';

import { Form } from '../components/form/form';
import { areBenefitsValid } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { clearFields, handleClearSelection, renderPage } from './helpers/NonHmctsControllerHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantBenefitsController');

export default class ClaimantBenefitsController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      employeeBenefits: {
        id: 'employee-benefits',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'l',
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              benefitsCharCount: {
                id: 'benefits-char-count',
                name: 'benefits-char-count',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.hint,
                labelHidden: false,
                labelAsHint: true,
                maxlength: 2500,
                attributes: { maxLength: 2500 },
                validator: areBenefitsValid,
              },
            },
          },
          { label: (l: AnyRecord): string => l.no, value: YesOrNo.NO },
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_NEW_JOB);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'employeeBenefits', 'benefitsCharCount'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_BENEFITS, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
