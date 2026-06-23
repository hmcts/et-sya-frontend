import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
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
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('ClaimantRepEditNameController');

export default class ClaimantRepEditNameController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      representativeName: {
        id: 'representativeName',
        name: 'representativeName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.representativeName,
        labelSize: 'm',
        attributes: { maxLength: 100 },
        validator: isFieldFilledIn,
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
      TranslationKeys.CLAIMANT_REP_EDIT_NAME,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());

    res.render(TranslationKeys.CLAIMANT_REP_EDIT_NAME, {
      ...content,
      backLinkUrl: getClaimantRepAboutYouPageUrl(caseId, req),
    });
  };
}
