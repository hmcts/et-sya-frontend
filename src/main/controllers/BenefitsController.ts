import { Response } from 'express';

import { Form } from '../components/form/form';
import { areBenefitsValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('BenefitsController');

export default class BenefitsController {
  private readonly form: Form;
  private readonly benefitsContent: FormContent = {
    fields: {
      employeeBenefits: {
        id: 'employee-benefits',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'l',
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
                labelHidden: false,
                labelAsHint: true,
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

  constructor() {
    this.form = new Form(<FormFields>this.benefitsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    let redirectUrl = '';
    if (req.session.userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      redirectUrl = PageUrls.NEW_JOB;
    } else {
      redirectUrl = PageUrls.FIRST_RESPONDENT_NAME;
    }
    handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.benefitsContent, [TranslationKeys.COMMON, TranslationKeys.BENEFITS]);
    const employmentStatus = req.session.userCase.isStillWorking;
    const employeeBenefits = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    employeeBenefits.label =
      employmentStatus === 'Working' || employmentStatus === 'Notice'
        ? l => l.workingOrNoticeLegend
        : l => l.noLongerWorkingLegend;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.BENEFITS, {
      ...content,
      employmentStatus,
    });
  };
}
