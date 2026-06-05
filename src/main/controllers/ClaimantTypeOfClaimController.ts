import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { getTypeOfClaimFormValues } from './helpers/FormHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantTypeOfClaimController');

export default class ClaimantTypeOfClaimController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      typeOfClaim: {
        id: 'typeOfClaim',
        type: 'checkboxes',
        labelHidden: false,
        label: l => l.h1,
        labelSize: 'xl',
        isPageHeading: true,
        hint: l => l.hint,
        validator: atLeastOneFieldIsChecked,
        values: [
          ...getTypeOfClaimFormValues(),
          {
            id: 'otherTypes',
            name: 'typeOfClaim',
            label: l => l.otherTypesOfClaims.checkbox,
            value: TypesOfClaim.OTHER_TYPES,
            subFields: {
              otherClaim: {
                id: 'otherTypesOfClaims',
                type: 'charactercount',
                classes: 'govuk-label',
                label: (l: AnyRecord): string => l.otherTypesOfClaims.explain,
                labelSize: 'normal',
                labelHidden: false,
                maxlength: 100,
                attributes: { maxLength: 100 },
              },
            },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body);
    const typeOfClaim = formData.typeOfClaim;
    let redirectUrl = PageUrls.CLAIMANT_DESCRIBE_WHAT_HAPPENED.toString();
    if (typeOfClaim?.includes(TypesOfClaim.DISCRIMINATION.toString())) {
      redirectUrl = PageUrls.CLAIMANT_CLAIM_TYPE_DISCRIMINATION.toString();
    } else if (typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM.toString())) {
      redirectUrl = PageUrls.CLAIMANT_CLAIM_TYPE_PAY.toString();
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_TYPE_OF_CLAIM);
  };
}
