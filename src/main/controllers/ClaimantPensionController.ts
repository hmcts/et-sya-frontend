import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DefaultCurrencyFormFields } from '../definitions/currency-fields';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { clearFields, handleClearSelection, renderPage } from './helpers/NonHmctsControllerHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantPensionController');

export default class ClaimantPensionController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimantPensionContribution: {
        id: 'claimant-pension',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
            subFields: {
              claimantPensionWeeklyContribution: {
                ...DefaultCurrencyFormFields,
                id: 'pension-contributions',
                label: (l: AnyRecord): string => l.pensionContributions,
                labelAsHint: true,
              },
            },
          },
          { label: (l: AnyRecord): string => l.no, value: YesOrNoOrNotSure.NO },
          { label: (l: AnyRecord): string => l.notSure, value: YesOrNoOrNotSure.NOT_SURE },
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_BENEFITS);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'claimantPensionContribution', 'claimantPensionWeeklyContribution'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_PENSION, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
