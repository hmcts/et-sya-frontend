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
import { getLink, getSelectTitle } from '../helpers/RepresentativePostCodeHelper';

const logger = getLogger('RepresentedClaimantEnterEmailController');

export default class RepresentedClaimantEnterEmailController {
  private readonly form: Form;
  private readonly claimantEnterEmailContent: FormContent = {
    fields: {
      representedClaimantAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'representedClaimantAddressTypes',
        label: l => l.selectAddress,
        labelSize: 'xl',
        isPageHeading: true,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.claimantEnterEmailContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.claimantEnterEmailContent, [TranslationKeys.COMMON]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_ENTER_EMAIL, {
      ...content,
      link: getLink(req),
      title: getSelectTitle(req),
    });
  };
}
