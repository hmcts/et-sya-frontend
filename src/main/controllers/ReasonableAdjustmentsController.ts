import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ReasonableAdjustmentsController');

export default class ReasonableAdjustmentsController {
  private readonly form: Form;

  private readonly reasonableAdjustmentsContent: FormContent = {
    fields: {
      reasonableAdjustments: {
        classes: 'govuk-radios',
        id: 'reasonableAdjustments',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            name: 'reasonableAdjustments',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            hint: (l: AnyRecord): string => l.textAreaHint,
            subFields: {
              reasonableAdjustmentsDetail: {
                id: 'adjustmentDetailText',
                name: 'adjustmentDetailText',
                type: 'textarea',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.adjustmentDetailTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 2500 },
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'reasonableAdjustments',
            label: l => l.noSupport,
            value: YesOrNo.NO,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.reasonableAdjustmentsContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.PERSONAL_DETAILS_CHECK);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
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
