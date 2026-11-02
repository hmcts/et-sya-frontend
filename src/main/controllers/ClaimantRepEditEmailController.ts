import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidEmailAddress } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import {
  ensureClaimantRepCaseLoaded,
  getClaimantRepAboutYouPageUrl,
  handleRepAboutYouFieldPost,
  loadClaimantRepCase,
} from './helpers/ClaimantRepAboutYouHelper';
import { populateClaimantRepDetailsFromCase } from './helpers/ClaimantRepAnswersHelper';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ClaimantRepEditEmailController');

export default class ClaimantRepEditEmailController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimantRepEmail: {
        id: 'claimantRepEmail',
        name: 'claimantRepEmail',
        type: 'text',
        classes: 'govuk-!-width-two-thirds',
        label: (l: AnyRecord): string => l.emailLabel,
        labelSize: 'm',
        isPageHeading: true,
        hint: (l: AnyRecord): string => l.hint,
        attributes: {
          autocomplete: 'email',
          maxLength: 100,
        },
        validator: isValidEmailAddress,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (!(await ensureClaimantRepCaseLoaded(req))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }
    return handleRepAboutYouFieldPost(req, res, this.form, logger);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;
    if (!(await loadClaimantRepCase(req, caseId))) {
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_REP_EDIT_EMAIL,
    ]);
    populateClaimantRepDetailsFromCase(req.session.userCase, { loginEmail: req.session.user?.email });
    assignFormData(req.session.userCase, this.form.getFormFields());

    res.render(TranslationKeys.CLAIMANT_REP_EDIT_EMAIL, {
      ...content,
      backLinkUrl: getClaimantRepAboutYouPageUrl(caseId, req),
    });
  };
}
