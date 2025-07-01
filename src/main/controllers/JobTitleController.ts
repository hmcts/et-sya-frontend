import { Response } from 'express';

import { Form } from '../components/form/form';
import { isJobTitleValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('JobTitleController');

export default class JobTitleController {
  private readonly form: Form;
  private readonly jobTitleContent: FormContent = {
    fields: {
      jobTitle: {
        id: 'jobTitle',
        name: 'jobTitle',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.jobTitle,
        hint: (l: AnyRecord): string => l.hint,
        attributes: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          autocomplete: 'organization-title',
        },
        validator: isJobTitleValid,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.jobTitleContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.START_DATE);
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    const content = getPageContent(req, this.jobTitleContent, [TranslationKeys.COMMON, TranslationKeys.JOB_TITLE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.JOB_TITLE, {
      ...content,
    });
  };
}
