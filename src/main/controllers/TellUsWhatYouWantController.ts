import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

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

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.tellUsWhatYouWantFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrlCompensation = setUrlLanguage(req, PageUrls.COMPENSATION);
    const redirectUrlTribunalRec = setUrlLanguage(req, PageUrls.TRIBUNAL_RECOMMENDATION);
    const redirectUrlWhistleblowing = setUrlLanguage(req, PageUrls.WHISTLEBLOWING_CLAIMS);
    const redirectUrlClaimDetails = setUrlLanguage(req, PageUrls.CLAIM_DETAILS_CHECK);
    setUserCase(req, this.form);
    if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
      handleSessionErrors(req, res, this.form, redirectUrlCompensation);
    } else if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      handleSessionErrors(req, res, this.form, redirectUrlTribunalRec);
    } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      handleSessionErrors(req, res, this.form, redirectUrlWhistleblowing);
    } else {
      handleSessionErrors(req, res, this.form, redirectUrlClaimDetails);
    }
    handleUpdateDraftCase(req, this.logger);
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
