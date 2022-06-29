import { Response } from 'express';
import { cloneDeep } from 'lodash';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class TellUsWhatYouWantController {
  private readonly form: Form;
  private readonly tellUsWhatYouWantFormContent: FormContent = {
    fields: {
      tellUsWhatYouWant: {
        id: 'tellUsWhatYouWant',
        type: 'checkboxes',
        isPageHeading: true,
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

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    const selectedTellUsWhatYouWantOptions = this.form.getParsedBody(
      cloneDeep(req.body),
      this.form.getFormFields()
    ).tellUsWhatYouWant;

    if (selectedTellUsWhatYouWantOptions.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
      handleSessionErrors(req, res, this.form, PageUrls.COMPENSATION);
    } else if (selectedTellUsWhatYouWantOptions.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      handleSessionErrors(req, res, this.form, PageUrls.TRIBUNAL_RECOMMENDATION);
    } else if (req.session.userCase.typeOfClaim.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      handleSessionErrors(req, res, this.form, PageUrls.WHISTLEBLOWING_CLAIMS);
    } else {
      handleSessionErrors(req, res, this.form, PageUrls.CLAIM_DETAILS_CHECK);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
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
