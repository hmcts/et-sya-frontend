import { Request, Response } from 'express';

import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getPageContent } from '../helpers/FormHelpers';
import { getEnterEmailHeading, getEnterEmailTitle } from '../helpers/RepresentedClaimantEmailHelper';

export default class RepresentedClaimantDetailsCheckController {
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
  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.claimantEnterEmailContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTED_CLAIMANT_DETAILS_CHECK,
    ]);
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_DETAILS_CHECK, {
      ...content,
      title: getEnterEmailTitle(req),
      heading: getEnterEmailHeading(req),
    });
  };

  public post = (req: Request, res: Response): void => {
    // Handle form submission logic here
    res.redirect(PageUrls.REPRESENTATIVE_COMMS_PREFERENCE); // Replace with actual next page constant
  };
}
