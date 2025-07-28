import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address-validator';
import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';
import { getEnterTitle } from './helpers/WorkPostCodeHelper';

const logger = getLogger('WorkPostCodeEnterController');

export default class WorkPostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      workEnterPostcode: {
        id: 'workEnterPostcode',
        type: 'text',
        label: l => l.enterPostcode,
        classes: 'govuk-label govuk-!-width-one-half',
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
        validator: isValidUKPostcode,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.postCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.WORK_POSTCODE_SELECT);
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl, true);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_POSTCODE_ENTER, {
      ...content,
      link: getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK),
      title: getEnterTitle(req),
    });
  };
}
