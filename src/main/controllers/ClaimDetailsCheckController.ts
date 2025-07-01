import { Response } from 'express';

import { validateClaimCheckDetails } from '../components/form/claimDetailsValidator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ClaimDetailsCheckController');

export default class ClaimDetailsCheckController {
  private readonly form: Form;
  private readonly claimDetailsCheckFormContent: FormContent = {
    fields: {
      claimDetailsCheck: {
        ...DefaultRadioFormFields,
        id: 'claim-details-check',
        label: (l: AnyRecord): string => l.heading,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
        hint: (l: AnyRecord): string => l.p,
        classes: 'govuk-radios',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.claimDetailsCheckFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body?.claimDetailsCheck === 'Yes') {
      const userCase = req.session?.userCase;
      const isValid = validateClaimCheckDetails(userCase);

      req.session.errors = [];
      if (!isValid) {
        req.session.errors.push({ propertyName: 'claimDetailsCheck', errorType: 'invalid' });
        const content = getPageContent(req, this.claimDetailsCheckFormContent, [
          TranslationKeys.COMMON,
          TranslationKeys.CLAIM_DETAILS_CHECK,
        ]);
        return res.render(TranslationKeys.CLAIM_DETAILS_CHECK, {
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
    const content = getPageContent(req, this.claimDetailsCheckFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIM_DETAILS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIM_DETAILS_CHECK, {
      ...content,
    });
  };
}
