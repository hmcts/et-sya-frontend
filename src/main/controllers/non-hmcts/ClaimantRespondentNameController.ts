import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isRespondentNameValid } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogicForRespondent } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('ClaimantRespondentNameController');

export default class ClaimantRespondentNameController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      respondentName: {
        id: 'respondentName',
        name: 'respondentName',
        type: 'text',
        validator: isRespondentNameValid,
        label: (l: AnyRecord): string => l.label,
        attributes: { maxLength: 100 },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.params.respondentNumber = req.session.claimantRespondentNumber ?? '1';
    await handlePostLogicForRespondent(req, res, this.form, logger, PageUrls.CLAIMANT_RESPONDENT_POSTCODE_ENTER);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(
      req,
      this.formContent,
      [TranslationKeys.COMMON, TranslationKeys.CLAIMANT_RESPONDENT_NAME],
      0
    );
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_RESPONDENT_NAME, { ...content });
  };
}
