import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isValidPension } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PensionController {
  private readonly form: Form;
  private readonly pensionContent: FormContent = {
    fields: {
      claimantPensionContribution: {
        id: 'pension',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.label,
        labelHidden: true,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
            subFields: {
              claimantPensionWeeklyContribution: {
                id: 'pension-contributions',
                name: 'pension-contributions',
                type: 'currency',
                classes: 'govuk-input--width-5',
                hint: (l: AnyRecord): string => l.pensionContributions,
                attributes: { maxLength: 12 },
                validator: isValidPension,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
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
    this.form = new Form(<FormFields>this.pensionContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(() => {
        this.logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      })
      .catch(error => {
        this.logger.info(error);
      });
    handleSessionErrors(req, res, this.form, PageUrls.BENEFITS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.pensionContent, [TranslationKeys.COMMON, TranslationKeys.PENSION]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PENSION, {
      ...content,
    });
  };
}
