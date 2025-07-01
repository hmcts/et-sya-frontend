import { Response } from 'express';

import { Form } from '../components/form/form';
import { areBenefitsValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

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

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.employeeBenefits = undefined;
      req.session.userCase.benefitsCharCount = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl = '';
    if (req.session.userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      redirectUrl = PageUrls.NEW_JOB;
    } else {
      redirectUrl = PageUrls.FIRST_RESPONDENT_NAME;
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.benefitsContent, [TranslationKeys.COMMON, TranslationKeys.BENEFITS]);
    const employmentStatus = req.session.userCase.isStillWorking;
    const employeeBenefits = Object.entries(this.form.getFormFields())[0][1];

    if (employmentStatus === StillWorking.NO_LONGER_WORKING) {
      employeeBenefits.label = l => l.noLongerWorkingLegend;
      employeeBenefits.values[0].label = l => l.yesPast;
      employeeBenefits.values[1].label = l => l.noPast;
    } else {
      employeeBenefits.label = l => l.workingOrNoticeLegend;
      employeeBenefits.values[0].label = l => l.yes;
      employeeBenefits.values[1].label = l => l.no;
    }

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.BENEFITS, {
      ...content,
      employmentStatus,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
