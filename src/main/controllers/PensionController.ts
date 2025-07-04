import { Response } from 'express';

import { isValidPension } from '../components/form/currency-validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('PensionController');

export default class PensionController {
  private readonly form: Form;
  private readonly pensionContent: FormContent = {
    fields: {
      claimantPensionContribution: {
        id: 'pension',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'xl',
        isPageHeading: true,
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
                label: (l: AnyRecord): string => l.pensionContributions,
                labelAsHint: true,
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

  constructor() {
    this.form = new Form(<FormFields>this.pensionContent.fields);
  }

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.claimantPensionContribution = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.BENEFITS);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.pensionContent, [TranslationKeys.COMMON, TranslationKeys.PENSION]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PENSION, {
      ...content,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}
