import { Request, Response } from 'express';

import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getPageContent } from '../helpers/FormHelpers';
import { getEnterEmailHeading, getEnterEmailTitle } from '../helpers/RepresentedClaimantEmailHelper';

export default class RepresentedClaimantDetailsCheckController {
  private readonly representedClaimantDetailsCheckContent: FormContent = {
    fields: {
      representedClaimantDetailsCheckTitle: {
        id: 'representedClaimantDetailsCheckTitle',
        name: 'representedClaimantDetailsCheckTitle',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: l => l.representedClaimantDetailsCheckTitle,
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
    const content = getPageContent(req, this.representedClaimantDetailsCheckContent, [
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
