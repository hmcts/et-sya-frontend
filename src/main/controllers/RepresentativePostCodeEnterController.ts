import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address-validator';
import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import {
  ensureClaimantRepCaseLoaded,
  handleRepAboutYouPostLogic,
  isClaimantRepAboutYouFlow,
} from './helpers/ClaimantRepAboutYouHelper';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getEnterTitle, getLink } from './helpers/RepresentativePostCodeHelper';

const logger = getLogger('RepresentativePostCodeEnterController');

export default class RepresentativePostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      representativeEnterPostcode: {
        id: 'representativeEnterPostcode',
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
    if (isClaimantRepAboutYouFlow(req)) {
      return handleRepAboutYouPostLogic(req, res, this.form, logger, PageUrls.REPRESENTATIVE_POSTCODE_SELECT);
    }
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTATIVE_POSTCODE_SELECT);
  };

  @CaseStateCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (isClaimantRepAboutYouFlow(req) && !(await ensureClaimantRepCaseLoaded(req))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTATIVE_POSTCODE_ENTER, {
      ...content,
      link: getLink(req),
      title: getEnterTitle(req),
    });
  };
}
