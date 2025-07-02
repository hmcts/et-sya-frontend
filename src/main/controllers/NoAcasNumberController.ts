import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { NoAcasNumberReason } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentIndex } from './helpers/RespondentHelpers';

const logger = getLogger('NoAcasNumberController');

export default class NoAcasNumberController {
  private readonly form: Form;
  private readonly noAcasNumberContent: FormContent = {
    fields: {
      noAcasReason: {
        classes: 'govuk-radios',
        id: 'no-acas-reason',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        values: [
          {
            name: 'another',
            label: (l: AnyRecord): string => l.another,
            value: NoAcasNumberReason.ANOTHER,
          },
          {
            name: 'no_power',
            label: (l: AnyRecord): string => l.no_power,
            value: NoAcasNumberReason.NO_POWER,
          },
          {
            name: 'employer',
            label: (l: AnyRecord): string => l.employer,
            value: NoAcasNumberReason.EMPLOYER,
          },
          {
            name: 'unfair_dismissal',
            label: (l: AnyRecord): string => l.unfair_dismissal,
            value: NoAcasNumberReason.UNFAIR_DISMISSAL,
            hint: (l: AnyRecord): string => l.dismissalHint,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.noAcasNumberContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (req.body.saveForLater) {
      redirectUrl = PageUrls.CLAIM_SAVED;
    } else {
      redirectUrl = req.session.respondentRedirectCheckAnswer
        ? PageUrls.CHECK_ANSWERS
        : PageUrls.RESPONDENT_DETAILS_CHECK;
    }
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondentIndex = getRespondentIndex(req);
    const content = getPageContent(
      req,
      this.noAcasNumberContent,
      [TranslationKeys.COMMON, TranslationKeys.NO_ACAS_NUMBER],
      respondentIndex
    );
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NO_ACAS_NUMBER, {
      ...content,
    });
  };
}
