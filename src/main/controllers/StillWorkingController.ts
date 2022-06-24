import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class StillWorkingController {
  private readonly form: Form;
  private readonly stillWorkingContent: FormContent = {
    fields: {
      isStillWorking: {
        classes: 'govuk-radios',
        id: 'still-working',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        labelHidden: true,
        values: [
          {
            name: 'working',
            label: (l: AnyRecord): string => l.optionText1,
            value: StillWorking.WORKING,
          },
          {
            name: 'working_notice',
            label: (l: AnyRecord): string => l.optionText2,
            value: StillWorking.NOTICE,
          },
          {
            name: 'not_working',
            label: (l: AnyRecord): string => l.optionText3,
            value: StillWorking.NO_LONGER_WORKING,
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
    this.form = new Form(<FormFields>this.stillWorkingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = PageUrls.JOB_TITLE;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.stillWorkingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STILL_WORKING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.STILL_WORKING, {
      ...content,
    });
  };
}
