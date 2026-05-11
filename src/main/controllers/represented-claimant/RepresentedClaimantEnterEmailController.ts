import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import {
  getEnterEmailDescription,
  getEnterEmailHeading,
  getEnterEmailTitle,
} from '../helpers/RepresentedClaimantEmailHelper';

const logger = getLogger('RepresentedClaimantEnterEmailController');

export default class RepresentedClaimantEnterEmailController {
  private readonly form: Form;
  private readonly claimantEnterEmailContent: FormContent = {
    fields: {
      representedClaimantEmail: {
        id: 'representedClaimantEmail',
        name: 'representedClaimantEmail',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: l => l.representedClaimantEnterEmailLabel,
        labelSize: 'm',
        isPageHeading: true,
        attributes: {
          autocomplete: 'email',
          maxLength: 100,
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.claimantEnterEmailContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTATIVE_COMMS_PREFERENCE);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.claimantEnterEmailContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTED_CLAIMANT_ENTER_EMAIL,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_ENTER_EMAIL, {
      ...content,
      title: getEnterEmailTitle(req),
      heading: getEnterEmailHeading(req),
      description: getEnterEmailDescription(req),
    });
  };
}
