import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { AppRequest } from '../../definitions/appRequest';
import { AddAdditionalClaimant } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('AddAnotherClaimantController');

export default class AddAnotherClaimantController {
  private readonly form: Form;
  private readonly addAnotherClaimantContent: FormContent = {
    fields: {
      addClaimantMethod: {
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        classes: 'govuk-radios',
        id: 'add-claimant-method',
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            value: AddAdditionalClaimant.MANUAL,
            hint: (l: AnyRecord): string => l.radio1Hint,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: AddAdditionalClaimant.SPREADSHEET,
            hint: (l: AnyRecord): string => l.radio2Hint,
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
    this.form = new Form(<FormFields>this.addAnotherClaimantContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl: string;
    const claimantsLength = req.session?.userCase?.additionalClaimants?.length ?? 0;
    if (AddAdditionalClaimant.MANUAL === req.body.addClaimantMethod && claimantsLength === 0) {
      req.session.additionalClaimantNewFlow = true;
      redirectUrl = `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}?additionalClaimant=new-claimant`;
    } else {
      redirectUrl = PageUrls.REVIEW_ADDITIONAL_CLAIMANTS;
    }
    logger.info(
      `Handling add another claimant submission. Selected method: ${
        req.body.addClaimantMethod || 'none'
      }, redirecting to: ${redirectUrl}`
    );
    return handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    logger.info('Rendering add another claimant page');
    const content = getPageContent(req, this.addAnotherClaimantContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ADD_ANOTHER_CLAIMANT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ADD_ANOTHER_CLAIMANT, {
      ...content,
    });
  };
}
