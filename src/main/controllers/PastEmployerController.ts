import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { conditionalRedirect, returnNextPage } from './helpers/RouterHelpers';

const logger = getLogger('PastEmployerController');

export default class PastEmployerController {
  private readonly form: Form;
  private readonly pastEmployerFormContent: FormContent = {
    fields: {
      pastEmployer: {
        ...DefaultRadioFormFields,
        label: (l: AnyRecord): string => l.heading,
        labelHidden: true,
        id: 'past-employer',
        classes: 'govuk-radios--inline',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.pastEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    handleSessionErrors(req, res, this.form);
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.STILL_WORKING
      : PageUrls.FIRST_RESPONDENT_NAME;
    setUserCase(req, this.form);
    handleUpdateDraftCase(req, logger);
    returnNextPage(req, res, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.pastEmployerFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.PAST_EMPLOYER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAST_EMPLOYER, {
      ...content,
    });
  };
}
