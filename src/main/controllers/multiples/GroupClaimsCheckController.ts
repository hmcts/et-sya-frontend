import { Response } from 'express';

import { validateGroupClaimsCheckDetails } from '../../components/form/claim-details-validator';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('GroupClaimsCheckController');

export default class GroupClaimsCheckController {
  private readonly form: Form;
  private readonly groupClaimsCheckFormContent: FormContent = {
    fields: {
      groupClaimsCheck: {
        ...DefaultRadioFormFields,
        label: (l: AnyRecord): string => l.heading,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        hint: (l: AnyRecord): string => l.p,
        id: 'tasklist-check',
        classes: 'govuk-radios',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.groupClaimsCheckFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.userCase.groupClaimsCheck = req.body?.groupClaimsCheck;

    if (req.body?.groupClaimsCheck === 'Yes') {
      const userCase = req.session?.userCase;
      const isValid = validateGroupClaimsCheckDetails(userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: 'groupClaimsCheck', errorType: 'invalid' });
        const content = getPageContent(req, this.groupClaimsCheckFormContent, [
          TranslationKeys.COMMON,
          TranslationKeys.GROUP_CLAIMS_CHECK,
        ]);
        return res.render(TranslationKeys.GROUP_CLAIMS_CHECK, {
          ...content,
        });
      }
    }

    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIM_STEPS);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.groupClaimsCheckFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.GROUP_CLAIMS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.GROUP_CLAIMS_CHECK, {
      ...content,
    });
  };
}
