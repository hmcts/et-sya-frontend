import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('TellUsWhatYouWantController');

export default class TellUsWhatYouWantController {
  private readonly form: Form;
  private readonly tellUsWhatYouWantFormContent: FormContent = {
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
    this.form = new Form(<FormFields>this.tellUsWhatYouWantFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (req.body.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
      redirectUrl = PageUrls.COMPENSATION;
    } else if (req.body.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      redirectUrl = PageUrls.TRIBUNAL_RECOMMENDATION;
    } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      redirectUrl = PageUrls.WHISTLEBLOWING_CLAIMS;
    } else {
      redirectUrl = PageUrls.LINKED_CASES;
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    const content = getPageContent(req, this.tellUsWhatYouWantFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TELL_US_WHAT_YOU_WANT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TELL_US_WHAT_YOU_WANT, {
      ...content,
    });
  };
}
