import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isValidEmailAddressWhenProvided } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { getPageContent } from '../helpers/FormHelpers';
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
        validator: isValidEmailAddressWhenProvided,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.claimantEnterEmailContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = (req.session.userCase ??= {} as CaseWithId);
    userCase.representedClaimantEmailProvided = req.body?.representedClaimantEmail?.trim() ? YesOrNo.YES : YesOrNo.NO;
    logger.info('representedClaimantEmailProvided', userCase.representedClaimantEmailProvided);
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_DETAILS_CHECK);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.claimantEnterEmailContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTED_CLAIMANT_ENTER_EMAIL,
    ]);
    const emailProvided = req.session.userCase?.representedClaimantEmailProvided === YesOrNo.YES;
    const userCase = emailProvided ? content.userCase : { ...content.userCase, representedClaimantEmail: undefined };
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_ENTER_EMAIL, {
      ...content,
      userCase,
      title: getEnterEmailTitle(req),
      heading: getEnterEmailHeading(req),
      description: getEnterEmailDescription(req),
    });
  };
}
