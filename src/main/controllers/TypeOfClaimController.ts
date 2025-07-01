import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, RedisErrors, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('TypeOfClaimController');

export default class TypeOfClaimController {
  private readonly form: Form;
  private readonly typeOfClaimFormContent: FormContent = {
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
          {
            id: 'discrimination',
            name: 'typeOfClaim',
            label: l => l.discrimination.checkbox,
            value: TypesOfClaim.DISCRIMINATION,
            hint: h => h.discrimination.hint,
          },
          {
            id: 'payRelatedClaim',
            name: 'typeOfClaim',
            label: l => l.payRelated.checkbox,
            value: TypesOfClaim.PAY_RELATED_CLAIM,
          },
          {
            id: 'unfairDismissal',
            name: 'typeOfClaim',
            label: l => l.unfairDismissal.checkbox,
            value: TypesOfClaim.UNFAIR_DISMISSAL,
            hint: h => h.unfairDismissal.hint,
          },
          {
            id: 'whistleBlowing',
            name: 'typeOfClaim',
            label: l => l.whistleBlowing.checkbox,
            value: TypesOfClaim.WHISTLE_BLOWING,
            hint: h => h.whistleBlowing.hint,
          },
          {
            id: 'otherTypes',
            name: 'typeOfClaim',
            label: l => l.otherTypesOfClaims.checkbox,
            subFields: {
              otherClaim: {
                id: 'otherTypesOfClaims',
                type: 'charactercount',
                classes: 'govuk-label',
                label: l => l.otherTypesOfClaims.explain,
                labelSize: 'normal',
                labelHidden: false,
                maxlength: 100,
              },
            },
            value: 'otherTypesOfClaims',
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.typeOfClaimFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl = PageUrls.DESCRIBE_WHAT_HAPPENED.toString();
    const formData = this.form.getParsedBody(req.body);
    const typeOfClaim = formData.typeOfClaim;
    if (typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM.toString())) {
      redirectUrl = PageUrls.CLAIM_TYPE_PAY.toString();
    } else if (typeOfClaim?.includes(TypesOfClaim.DISCRIMINATION.toString())) {
      redirectUrl = PageUrls.CLAIM_TYPE_DISCRIMINATION.toString();
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    const content = getPageContent(req, this.typeOfClaimFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TYPE_OF_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TYPE_OF_CLAIM, {
      ...content,
      redisError: req.app?.get(RedisErrors.REDIS_ERROR),
    });
  };
}
