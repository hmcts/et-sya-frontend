import { Response } from 'express';

import { validateRepresentativeDetails } from '../components/form/claim-details-validator';
import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('RepresentativeDetailsCheckController');

export default class RepresentativeDetailsCheckController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      representativeDetailsCheck: {
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
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body?.representativeDetailsCheck === 'Yes') {
      const isValid = validateRepresentativeDetails(req.session?.userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: 'representativeDetailsCheck', errorType: 'invalid' });
        const content = getPageContent(req, this.formContent, [
          TranslationKeys.COMMON,
          TranslationKeys.REPRESENTATIVE_DETAILS_CHECK,
        ]);
        return res.render(TranslationKeys.TASK_LIST_CHECK, {
          ...content,
        });
      }
    }

    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIM_STEPS_NON_HMCTS);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTATIVE_DETAILS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TASK_LIST_CHECK, {
      ...content,
    });
  };
}
