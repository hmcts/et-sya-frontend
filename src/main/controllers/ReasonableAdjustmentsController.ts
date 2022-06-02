import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class ReasonableAdjustmentsController {
  private readonly form: Form;

  private readonly reasonableAdjustmentsContent: FormContent = {
    fields: {
      reasonableAdjustments: {
        classes: 'govuk-radios',
        id: 'reasonableAdjustments',
        type: 'radios',
        label: (l: AnyRecord): string => l.h1,
        isPageHeading: true,
        values: [
          {
            name: 'reasonableAdjustments',
            label: (l: AnyRecord): string => l.yes,
            subFields: {
              adjustmentDetail: {
                id: 'adjustmentDetailText',
                name: 'adjustmentDetailText',
                type: 'text',
                label: (l: AnyRecord): string => l.adjustmentDetailTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 5000 },
              },
            },
          },
          {
            name: 'reasonableAdjustments',
            label: l => l.noSupport,
            value: 'noSupport',
          },
        ],
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
    this.form = new Form(<FormFields>this.reasonableAdjustmentsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.TASK_LIST_CHECK);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.reasonableAdjustmentsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REASONABLE_ADJUSTMENTS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('reasonable-adjustments', {
      ...content,
    });
  };
}
