import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { CaseType, CaseWithId } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('SingleOrMultipleController');

export default class SingleOrMultipleController {
  private readonly form: Form;
  private readonly singleOrMultipleContent: FormContent = {
    fields: {
      caseType: {
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        classes: 'govuk-radios',
        id: 'single-or-multiple-claim',
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            value: CaseType.SINGLE,
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value: CaseType.MULTIPLE,
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
    this.form = new Form(<FormFields>this.singleOrMultipleContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    let redirectUrl;
    if (CaseType.SINGLE === req.body.caseType) {
      this.clearGroupClaimsFields(userCase);
      redirectUrl = PageUrls.GROUP_CLAIMS_CHECK;
    } else if (CaseType.MULTIPLE === req.body.caseType && userCase?.additionalClaimants?.length > 0) {
      redirectUrl = PageUrls.REVIEW_ADDITIONAL_CLAIMANTS;
    } else {
      redirectUrl = PageUrls.ADD_ANOTHER_CLAIMANT;
    }
    return handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  private clearGroupClaimsFields(userCase: CaseWithId) {
    userCase.addClaimantMethod = undefined;
    userCase.additionalClaimants = undefined;
    userCase.leadClaimant = undefined;
  }

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.singleOrMultipleContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SINGLE_OR_MULTIPLE_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.SINGLE_OR_MULTIPLE_CLAIM, {
      ...content,
    });
  };
}
