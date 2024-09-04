import config from 'config';
import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { conditionalRedirect, getLanguageParam } from './helpers/RouterHelpers';

export default class ReturnToExistingController {
  private readonly form: Form;
  private readonly returnToExistingContent: FormContent = {
    fields: {
      returnToExisting: {
        id: 'return_number_or_account',
        type: 'radios',
        classes: 'govuk-date-input',
        label: (l: AnyRecord): string => l.p2,
        labelHidden: true,
        values: [
          {
            name: 'have_return_number',
            label: (l: AnyRecord): string => l.optionText1,
            value: YesOrNo.YES,
            selected: false,
          },
          {
            name: 'have_account',
            label: (l: AnyRecord): string => l.optionText2,
            value: YesOrNo.NO,
            selected: false,
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
    this.form = new Form(<FormFields>this.returnToExistingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? process.env.ET1_BASE_URL ?? `${config.get('services.et1Legacy.url')}`
      : PageUrls.CLAIMANT_APPLICATIONS;
    handlePostLogicPreLogin(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    req.session.guid = undefined;
    const content = getPageContent(req, this.returnToExistingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RETURN_TO_EXISTING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('return-to-claim', {
      ...content,
      startNewClaimUrl: PageUrls.CHECKLIST + getLanguageParam(req.url),
    });
  };
}
