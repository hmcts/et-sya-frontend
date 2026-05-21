import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimTypeDiscrimination } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantClaimTypeDiscriminationController');

export default class ClaimantClaimTypeDiscriminationController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimTypeDiscrimination: {
        id: 'claimTypeDiscrimination',
        type: 'checkboxes',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        hint: l => l.hint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'age',
            name: 'claimTypeDiscrimination',
            label: l => l.age.checkbox,
            value: ClaimTypeDiscrimination.AGE,
          },
          {
            id: 'disability',
            name: 'claimTypeDiscrimination',
            label: l => l.disability.checkbox,
            value: ClaimTypeDiscrimination.DISABILITY,
          },
          {
            id: 'genderReassignment',
            name: 'claimTypeDiscrimination',
            label: l => l.genderReassignment.checkbox,
            value: ClaimTypeDiscrimination.GENDER_REASSIGNMENT,
          },
          {
            id: 'marriageOrCivilPartnership',
            name: 'claimTypeDiscrimination',
            label: l => l.marriageOrCivilPartnership.checkbox,
            value: ClaimTypeDiscrimination.MARRIAGE_OR_CIVIL_PARTNERSHIP,
          },
          {
            id: 'pregnancyOrMaternity',
            name: 'claimTypeDiscrimination',
            label: l => l.pregnancyOrMaternity.checkbox,
            value: ClaimTypeDiscrimination.PREGNANCY_OR_MATERNITY,
          },
          {
            id: 'race',
            name: 'claimTypeDiscrimination',
            label: l => l.race.checkbox,
            value: ClaimTypeDiscrimination.RACE,
            hint: h => h.race.hint,
          },
          {
            id: 'religionOrBelief',
            name: 'claimTypeDiscrimination',
            label: l => l.religionOrBelief.checkbox,
            value: ClaimTypeDiscrimination.RELIGION_OR_BELIEF,
          },
          {
            id: 'sex',
            name: 'claimTypeDiscrimination',
            label: l => l.sex.checkbox,
            value: ClaimTypeDiscrimination.SEX,
            hint: h => h.sex.hint,
          },
          {
            id: 'sexualOrientation',
            name: 'claimTypeDiscrimination',
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
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.DESCRIBE_WHAT_HAPPENED);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_CLAIM_TYPE_DISCRIMINATION);
  };
}
