import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('RemoveAdditionalClaimantController');

export default class RemoveAdditionalClaimantController {
  private readonly form: Form;
  private readonly removeContent: FormContent = {
    fields: {
      removeAdditionalClaimant: {
        classes: 'govuk-radios',
        id: 'remove-other-claimant',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'xl',
        labelHidden: false,
        isPageHeading: true,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.removeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const indexStr = req.query?.index as string;
    const index = Number.parseInt(indexStr, 10);
    logger.info(
      `Handling remove other claimant submission. Index: ${Number.isNaN(index) ? 'invalid' : index}, answer: ${
        req.body.removeAdditionalClaimant || 'none'
      }`
    );

    if (req.body.removeAdditionalClaimant === YesOrNo.YES && !Number.isNaN(index)) {
      const claimants = req.session.userCase?.additionalClaimants || [];
      if (index >= 0 && index < claimants.length) {
        req.session.userCase.additionalClaimants = undefined;
        logger.info(`Removed claimant at index ${index}. Remaining claimant count: ${claimants.length}`);
      }
    }
    return handlePostLogic(req, res, this.form, logger, PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    logger.info(`Rendering remove other claimant page. Query index: ${(req.query?.index as string) || 'none'}`);
    const content = getPageContent(req, this.removeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REMOVE_ADDITIONAL_CLAIMANT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REMOVE_ADDITIONAL_CLAIMANT, {
      ...content,
    });
  };
}
