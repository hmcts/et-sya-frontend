import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { returnNextPage } from './helpers/RouterHelpers';

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

  public post = (req: AppRequest, res: Response): void => {
    handleSessionErrors(req, res, this.form);
    setUserCase(req, this.form);
    handleUpdateDraftCase(req, logger);
    if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
      returnNextPage(req, res, PageUrls.COMPENSATION);
    } else if (req.session.userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      returnNextPage(req, res, PageUrls.TRIBUNAL_RECOMMENDATION);
    } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      returnNextPage(req, res, PageUrls.WHISTLEBLOWING_CLAIMS);
    } else {
      returnNextPage(req, res, PageUrls.CLAIM_DETAILS_CHECK);
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
