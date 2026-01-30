import { AxiosResponse } from 'axios';
import { Response } from 'express';

import { Form } from '../components/form/form';
import { isValidEthosCaseReference } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from './helpers/RouterHelpers';

export default class CaseNumberController {
  private readonly form: Form;
  private readonly caseNumberContent: FormContent = {
    fields: {
      ethosCaseReference: {
        id: 'ethosCaseReference',
        name: 'ethosCaseReference',
        type: 'text',
        validator: isValidEthosCaseReference,
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        attributes: { maxLength: 16 },
        classes: 'govuk-!-width-one-half',
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.caseNumberContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    if (!req.session.userCase) {
      req.session.userCase = { createdDate: '', id: '', lastModified: '', state: undefined };
    }
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length > 0) {
      req.session.errors = errors;
      return handlePostLogicPreLogin(req, res, this.form, PageUrls.CASE_NUMBER_CHECK + languageParam);
    }
    req.session.errors = [];
    req.session.caseNumberChecked = false;
    req.session.userCase.ethosCaseReference = formData.ethosCaseReference;
    const isReformCase: AxiosResponse<string> = await getCaseApi(req.session.user?.accessToken).checkEthosCaseReference(
      formData.ethosCaseReference
    );

    if ((isReformCase?.data && isReformCase.data !== 'false') || isReformCase?.data === 'true') {
      req.session.caseNumberChecked = true;
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM + languageParam)));
    } else {
      req.session.errors.push({ propertyName: 'ethosCaseReference', errorType: 'caseNotFound' });
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CASE_NUMBER_CHECK + languageParam)));
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.caseNumberContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CASE_NUMBER_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CASE_NUMBER_CHECK, {
      ...content,
    });
  };
}
