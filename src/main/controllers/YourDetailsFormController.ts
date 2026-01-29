import { Response as ExpressResponse } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('SelfAssignmentFormController');

export default class YourDetailsFormController {
  private readonly form: Form;
  private readonly caseReferenceIdContent: FormContent = {
    fields: {
      submissionReference: {
        id: 'submissionReference',
        name: 'submissionReference',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.submissionReference.label,
      },
      claimantName: {
        id: 'claimantName',
        name: 'claimantName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.claimantName.label,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.caseReferenceIdContent.fields);
  }

  public post = async (req: AppRequest, res: ExpressResponse): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    return handlePostLogic(req, res, this.form, logger, PageUrls.HOME + languageParam);
  };

  public get = (req: AppRequest, res: ExpressResponse): void => {
    const languageParam: string = getLanguageParam(req.url);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.YOUR_DETAILS_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.YOUR_DETAILS_FORM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      languageParam,
      form: this.caseReferenceIdContent,
      sessionErrors: req.session.errors,
      userCase: req.session?.userCase,
    });
  };
}
