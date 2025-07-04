import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimTypeDiscrimination, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ClaimTypeDiscriminationController');

export default class ClaimTypeDiscriminationController {
  private readonly form: Form;
  private readonly claimTypeDiscriminationFormContent: FormContent = {
    fields: {
      claimTypeDiscrimination: {
        id: 'claimTypeDiscrimination',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'checkboxes',
        hint: l => l.selectAllHint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'age',
            label: l => l.age.checkbox,
            value: ClaimTypeDiscrimination.AGE,
          },
          {
            id: 'disability',
            label: l => l.disability.checkbox,
            value: ClaimTypeDiscrimination.DISABILITY,
          },
          {
            id: 'genderReassignment',
            label: l => l.genderReassignment.checkbox,
            value: ClaimTypeDiscrimination.GENDER_REASSIGNMENT,
          },
          {
            id: 'marriageOrCivilPartnership',
            label: l => l.marriageOrCivilPartnership.checkbox,
            value: ClaimTypeDiscrimination.MARRIAGE_OR_CIVIL_PARTNERSHIP,
          },
          {
            id: 'pregnancyOrMaternity',
            label: l => l.pregnancyOrMaternity.checkbox,
            value: ClaimTypeDiscrimination.PREGNANCY_OR_MATERNITY,
          },
          {
            id: 'race',
            label: l => l.race.checkbox,
            value: ClaimTypeDiscrimination.RACE,
          },
          {
            id: 'religionOrBelief',
            label: l => l.religionOrBelief.checkbox,
            value: ClaimTypeDiscrimination.RELIGION_OR_BELIEF,
          },
          {
            id: 'sex',
            label: l => l.sex.checkbox,
            value: ClaimTypeDiscrimination.SEX,
          },
          {
            id: 'sexualOrientation',
            label: l => l.sexualOrientation.checkbox,
            value: ClaimTypeDiscrimination.SEXUAL_ORIENTATION,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.claimTypeDiscriminationFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl = PageUrls.DESCRIBE_WHAT_HAPPENED.toString();
    if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM.toString())) {
      redirectUrl = PageUrls.CLAIM_TYPE_PAY.toString();
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimTypeDiscriminationFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIM_TYPE_DISCRIMINATION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIM_TYPE_DISCRIMINATION, {
      ...content,
    });
  };
}
