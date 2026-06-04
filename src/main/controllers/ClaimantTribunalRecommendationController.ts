import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ClaimantTribunalRecommendationController');

export default class ClaimantTribunalRecommendationController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      tribunalRecommendation: {
        id: 'tribunalRecommendation',
        type: 'textarea',
        label: (l: AnyRecord): string => l.label,
        labelSize: 'l',
        hint: (l: AnyRecord): string => l.hint,
        attributes: { title: 'Tribunal recommendation text area' },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_LINKED_CASES);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_TRIBUNAL_RECOMMENDATION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_TRIBUNAL_RECOMMENDATION, { ...content });
  };
}
