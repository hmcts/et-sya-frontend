import { AxiosResponse } from 'axios';
import { Response as ExpressResponse } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn, isValidCaseReferenceId } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { assignFormData } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from './helpers/RouterHelpers';
import YourDetailsFormControllerHelper from './helpers/YourDetailsFormControllerHelper';

const logger = getLogger('YourDetailsFormController');

export default class YourDetailsFormController {
  private readonly form: Form;
  private readonly caseReferenceIdContent: FormContent = {
    fields: {
      id: {
        id: 'caseReferenceId',
        name: 'caseReferenceId',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isValidCaseReferenceId,
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
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = [];
    req.session.userCase = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);
    const errors = this.form.getValidatorErrors(formData);
    let isReformCase: AxiosResponse<string> = undefined;
    if (errors.length === 0) {
      try {
        isReformCase = await getCaseApi(req.session.user?.accessToken).checkIdAndState(formData.id);
      } catch (error) {
        logger.error('Unable to check reform case' + error.message);
        req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'api' });
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM)));
      }
      if (isReformCase?.data.toString() === 'false') {
        logger.info(`Submission reference ${formData.id} not found`);
        req.session.errors.push({ propertyName: 'id', errorType: 'submissionReferenceNotFound' });
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM)));
      }
      const caseData = (await getCaseApi(req.session.user?.accessToken)?.getCaseByApplicationRequest(req))?.data;
      if (caseData) {
        logger.info(`Details have been found and match, redirect to CYA for Submission reference: ${formData.id}`);
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_CYA)));
      } else {
        logger.info(`Invalid case details. Submission reference: ${formData.id}`);
        req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'invalidCaseDetails' });
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM)));
      }
    } else {
      req.session.errors = errors;
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM)));
    }
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
