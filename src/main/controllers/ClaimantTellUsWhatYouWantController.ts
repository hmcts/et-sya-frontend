import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantTellUsWhatYouWantController');

export default class ClaimantTellUsWhatYouWantController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      tellUsWhatYouWant: {
        id: 'tellUsWhatYouWant',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
        type: 'checkboxes',
        hint: l => l.selectAllHint,
        validator: null,
        values: [
          {
            id: 'compensationOnly',
            label: l => l.compensationOnly.checkbox,
            hint: l => l.compensationOnlyHint,
            value: TellUsWhatYouWant.COMPENSATION_ONLY,
          },
          {
            id: 'tribunalRecommendation',
            label: l => l.tribunalRecommendation.checkbox,
            hint: l => l.tribunalRecommendationHint,
            value: TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION,
          },
          {
            id: 'oldJob',
            label: l => l.oldJob.checkbox,
            value: TellUsWhatYouWant.OLD_JOB,
          },
          {
            id: 'anotherJob',
            label: l => l.anotherJob.checkbox,
            value: TellUsWhatYouWant.ANOTHER_JOB,
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
    let redirectUrl: string;
    if (req.body.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
      redirectUrl = PageUrls.COMPENSATION;
    } else if (req.body.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      redirectUrl = PageUrls.TRIBUNAL_RECOMMENDATION;
    } else {
      redirectUrl = PageUrls.LINKED_CASES;
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_TELL_US_WHAT_YOU_WANT);
  };
}
