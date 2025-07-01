import { Response } from 'express';

import { validatePersonalDetails } from '../components/form/claimDetailsValidator';
import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('PersonalDetailsCheckController');

export default class PersonalDetailsCheckController {
  private readonly form: Form;
  private readonly personalDetailsCheckContent: FormContent = {
    fields: {
      personalDetailsCheck: {
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

  constructor() {
    this.form = new Form(<FormFields>this.personalDetailsCheckContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body?.personalDetailsCheck === 'Yes') {
      const userCase = req.session?.userCase;
      const isValid = validatePersonalDetails(userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: 'personalDetailsCheck', errorType: 'invalid' });
        const content = getPageContent(req, this.personalDetailsCheckContent, [
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
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    const content = getPageContent(req, this.personalDetailsCheckContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TASK_LIST_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TASK_LIST_CHECK, {
      ...content,
    });
  };
}
