import { Response } from 'express';

import { validateEmploymentAndRespondentDetails } from '../components/form/claim-details-validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('EmploymentAndRespondentCheckController');

export default class EmploymentAndRespondentCheckController {
  private readonly form: Form;
  private readonly empResCheckContent: FormContent = {
    fields: {
      employmentAndRespondentCheck: {
        ...DefaultRadioFormFields,
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        hint: (l: AnyRecord): string => l.hint,
        id: 'tasklist-check',
        classes: 'govuk-radios',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.empResCheckContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body?.employmentAndRespondentCheck === 'Yes') {
      const userCase = req.session?.userCase;
      const isValid = validateEmploymentAndRespondentDetails(userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: 'employmentAndRespondentCheck', errorType: 'invalid' });
        const content = getPageContent(req, this.empResCheckContent, [
          TranslationKeys.COMMON,
          TranslationKeys.TASK_LIST_CHECK,
        ]);
        return res.render(TranslationKeys.TASK_LIST_CHECK, {
          ...content,
        });
      }
    }

    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIM_STEPS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.empResCheckContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TASK_LIST_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TASK_LIST_CHECK, {
      ...content,
    });
  };
}
