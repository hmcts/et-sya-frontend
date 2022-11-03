import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { EmailOrPost } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { returnNextPage } from './helpers/RouterHelpers';

const logger = getLogger('UpdatePreferenceController');

export default class UpdatePreferenceController {
  private readonly form: Form;
  private readonly updatePrefFormContent: FormContent = {
    fields: {
      claimantContactPreference: {
        classes: 'govuk-radios--inline',
        id: 'update-preference',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.email,
            name: 'email',
            value: EmailOrPost.EMAIL,
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.post,
            name: 'post',
            value: EmailOrPost.POST,
            attributes: { maxLength: 2 },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.updatePrefFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    handleSessionErrors(req, res, this.form);
    setUserCase(req, this.form);
    handleUpdateDraftCase(req, logger);
    returnNextPage(req, res, PageUrls.VIDEO_HEARINGS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.updatePrefFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.UPDATE_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.UPDATE_PREFERENCE, {
      ...content,
    });
  };
}
