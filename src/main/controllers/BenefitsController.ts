import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { areBenefitsValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, handleUpdateDraftCase, setUserCase } from './helpers';

export default class BenefitsController {
  private readonly form: Form;
  private readonly benefitsContent: FormContent = {
    fields: {
      employeeBenefits: {
        id: 'employee-benefits',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.label,
        labelHidden: true,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              benefitsCharCount: {
                id: 'benefits-char-count',
                name: 'benefits-char-count',
                type: 'charactercount',
                label: (l: AnyRecord): string => l.hint,
                labelHidden: true,
                hint: (l: AnyRecord): string => l.hint,
                maxlength: 2500,
                attributes: { maxLength: 2500 },
                validator: areBenefitsValid,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.benefitsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const session = req.session;
    setUserCase(req, this.form);
    let redirectUrl = '';
    if (session.userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      redirectUrl = PageUrls.NEW_JOB;
    } else {
      redirectUrl = PageUrls.FIRST_RESPONDENT_NAME;
    }
    handleSessionErrors(req, res, this.form, redirectUrl);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.benefitsContent, [TranslationKeys.COMMON, TranslationKeys.BENEFITS]);
    const employmentStatus = req.session.userCase.isStillWorking;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.BENEFITS, {
      ...content,
      employmentStatus,
    });
  };
}
