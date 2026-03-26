import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AssignClaimCheck } from '../decorators/AssignClaimCheck';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { CaseAssignmentResponse, PageUrls, ServiceErrors, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';
import StringUtils from '../utils/StringUtils';

import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from './helpers/RouterHelpers';

const logger = getLogger('YourDetailsCYAController');

export default class YourDetailsCYAController {
  private readonly form: Form;
  private readonly detailsCheckContent: FormContent = {
    fields: {
      yourDetailsCya: {
        id: 'yourDetailsCya',
        type: 'checkboxes',
        labelHidden: true,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'confirmation',
            name: 'yourDetailsCya',
            label: (l: AnyRecord) => l.confirmation,
            value: YesOrNo.YES,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.detailsCheckContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_CYA)));
    }

    let caseAssignmentResponse;
    try {
      caseAssignmentResponse = await getCaseApi(req.session.user?.accessToken)?.assignCaseUserRole(req);
    } catch (error) {
      logger.info('Error creating caseAssignmentResponse', error.message.toString());
      if (
        StringUtils.isNotBlank(error?.message) &&
        error.message
          .toString()
          .includes(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_USER_ALREADY_HAS_ROLE_EXCEPTION_CHECK_VALUE)
      ) {
        logger.error(
          ServiceErrors.ERROR_ASSIGNING_USER_ROLE_USER_ALREADY_HAS_ROLE_EXCEPTION_CHECK_VALUE +
            'caseId: ' +
            req.session?.caseAssignmentFields?.id +
            ', ' +
            error
        );
        req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'caseAlreadyAssignedToSameUser' });
      } else if (
        StringUtils.isNotBlank(error?.message) &&
        error.message.toString().includes(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE)
      ) {
        logger.error(
          '--- CASE ALREADY ASSIGNED ERROR ---' +
            ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE +
            'caseId: ' +
            req.session?.caseAssignmentFields?.id +
            ', ' +
            'userId: ' +
            req.session?.user?.id
        );
        req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'caseAlreadyAssigned' });
      } else {
        logger.error(
          ServiceErrors.ERROR_ASSIGNING_USER_ROLE + 'caseId: ' + req.session?.caseAssignmentFields?.id + ', ' + error
        );
        req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'api' });
      }
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_CYA)));
    }

    if (!caseAssignmentResponse?.data) {
      logger.error(
        'Case assignment response data is null or undefined. caseId: ' + req.session?.caseAssignmentFields?.id
      );
      req.session.errors.push({ propertyName: 'hiddenErrorField', errorType: 'api' });
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.YOUR_DETAILS_CYA)));
    }

    logger.info('Case Assignment Response data message: ' + caseAssignmentResponse.data.message);

    if (
      CaseAssignmentResponse.ALREADY_ASSIGNED === caseAssignmentResponse?.data?.status &&
      caseAssignmentResponse?.data?.message.includes(CaseAssignmentResponse.USER_ALREADY_ASSIGNED_TO_THE_CASE)
    ) {
      logger.info(
        'User is already assigned to the case, redirect to the case: ' + req.session?.caseAssignmentFields?.id
      );
      const caseId = req.session?.caseAssignmentFields?.id;
      this.resetCaseAssignmentFieldsAndFlags(req);
      return res.redirect(`/citizen-hub/${caseId}${getLanguageParam(req.url)}`);
    }

    this.resetCaseAssignmentFieldsAndFlags(req);
    return res.redirect(`${PageUrls.CLAIMANT_APPLICATIONS}${getLanguageParam(req.url)}`);
  };

  private resetCaseAssignmentFieldsAndFlags(req: AppRequest<Partial<AnyRecord>>) {
    req.session.caseAssignmentFields = {};
    req.session.visitedAssignClaimFlow = false;
    req.session.caseNumberChecked = false;
    req.session.yourDetailsVerified = false;
  }

  @AssignClaimCheck()
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.caseAssignmentFields;

    const content = getPageContent(req, this.detailsCheckContent, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.YOUR_DETAILS_CYA,
    ]);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_DETAILS_CYA, { returnObjects: true }),
    };

    const cancelLink = setUrlLanguage(req, PageUrls.CLAIMANT_APPLICATIONS);
    const welshEnabled = await getFlagValue('welsh-language', null);
    const languageParam = getLanguageParam(req.url);

    res.render(TranslationKeys.YOUR_DETAILS_CYA, {
      ...content,
      ...translations,
      PageUrls,
      userCase,
      respondentNames: req.session.respondentNames || [],
      cancelLink,
      welshEnabled,
      languageParam,
      form: this.detailsCheckContent,
      sessionErrors: req.session?.errors || [],
    });
  };
}
