import { Response } from 'express';

import { validatePersonalDetails } from '../components/form/claim-details-validator';
import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { Logger, getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getClaimStepsUrl } from './helpers/RouterHelpers';

export default class PersonalDetailsCheckController {
  private readonly checkFieldName: string;
  private readonly checkTranslationKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly validateFn: (userCase: Record<string, any>) => boolean;
  private readonly getNextPageFn: (req: AppRequest) => string;
  private readonly logger: Logger;
  protected readonly form: Form;
  protected readonly formContent: FormContent;

  constructor(
    checkFieldName = 'personalDetailsCheck',
    checkTranslationKey: string = TranslationKeys.TASK_LIST_CHECK,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateFn: (userCase: Record<string, any>) => boolean = validatePersonalDetails,
    getNextPageFn: (req: AppRequest) => string = getClaimStepsUrl,
    loggerName = 'PersonalDetailsCheckController'
  ) {
    this.checkFieldName = checkFieldName;
    this.checkTranslationKey = checkTranslationKey;
    this.validateFn = validateFn;
    this.getNextPageFn = getNextPageFn;
    this.logger = getLogger(loggerName);
    this.formContent = {
      fields: {
        [checkFieldName]: {
          ...DefaultRadioFormFields,
          label: (l: AnyRecord): string => l.legend,
          labelHidden: false,
          labelSize: 'xl',
          isPageHeading: true,
          hint: (l: AnyRecord): string => l.hint,
          id: 'tasklist-check',
          classes: 'govuk-radios',
          validator: isFieldFilledIn,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body?.[this.checkFieldName] === 'Yes') {
      const isValid = this.validateFn(req.session?.userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: this.checkFieldName, errorType: 'invalid' });
        const content = getPageContent(req, this.formContent, [TranslationKeys.COMMON, this.checkTranslationKey]);

        return res.render(TranslationKeys.TASK_LIST_CHECK, {
          ...content,
        });
      }
    }

    await handlePostLogic(req, res, this.form, this.logger, this.getNextPageFn(req));
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [TranslationKeys.COMMON, this.checkTranslationKey]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TASK_LIST_CHECK, {
      ...content,
    });
  };
}
