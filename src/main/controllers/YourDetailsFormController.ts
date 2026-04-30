import { Response as ExpressResponse } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn, isValidCaseReferenceId, isValidEthosCaseReference } from '../components/form/validator';
import { AssignClaimCheck } from '../decorators/AssignClaimCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { assignFormData } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentIndex } from './helpers/RespondentHelpers';
import { getLanguageParam, returnValidUrl } from './helpers/RouterHelpers';

const logger = getLogger('YourDetailsFormController');

export default class YourDetailsFormController {
  private readonly form: Form;
  private readonly caseReferenceIdContent: FormContent = {
    fields: {
      ethosCaseReference: {
        id: 'ethosCaseReference',
        name: 'ethosCaseReference',
        type: 'text',
        validator: isValidEthosCaseReference,
        label: (l: AnyRecord): string => l.ethosCaseReference.label,
        attributes: { maxLength: 16 },
        classes: 'govuk-!-width-one-half',
      },
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

    if (!req.session.caseAssignmentFields) {
      req.session.caseAssignmentFields = {};
    }

    req.session.caseAssignmentFields = {
      ...req.session.caseAssignmentFields,
      ethosCaseReference: formData.ethosCaseReference,
      id: formData.id,
      claimantName: formData.claimantName,
      firstName: formData.claimantName.split(' ')[0],
      lastName: formData.claimantName.split(' ')[1],
    };

    const errors = this.form.getValidatorErrors(formData);
    if (errors.length === 0) {
      const caseData = (await getCaseApi(req.session.user?.accessToken)?.getCaseByApplicationRequest(req))?.data;
      if (caseData) {
        logger.info(`Details have been found and match, redirect to CYA for submission reference: ${formData.id}`);
        const respondentCollection = caseData.case_data.respondentCollection || [];
        req.session.respondentNames = respondentCollection.map(item => item.value?.respondent_name);

        const respondentIndex = getRespondentIndex(req) || 0;
        req.session.respondentName = respondentCollection[respondentIndex]?.value?.respondent_name;
        req.session.yourDetailsVerified = true;
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_CYA)));
      } else {
        logger.error(`Invalid case details. Submission reference: ${formData.id}`);
        req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'invalidCaseDetails' });
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM)));
      }
    } else {
      req.session.errors = errors;
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_FORM)));
    }
  };

  @AssignClaimCheck()
  public get = (req: AppRequest, res: ExpressResponse): void => {
    const languageParam: string = getLanguageParam(req.url);
    if (!req.session.caseAssignmentFields) {
      req.session.caseAssignmentFields = {};
    }
    assignFormData(req.session.caseAssignmentFields as CaseWithId, this.form.getFormFields());
    res.render(TranslationKeys.YOUR_DETAILS_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.YOUR_DETAILS_FORM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      languageParam,
      form: this.caseReferenceIdContent,
      sessionErrors: req.session.errors,
      userCase: req.session.caseAssignmentFields,
    });
  };
}
