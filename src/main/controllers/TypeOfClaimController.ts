import config from 'config';
import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseDataCacheKey } from '../definitions/case';
import { PageUrls, RedisErrors, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { getLogger } from '../logger';
import { cachePreloginCaseData } from '../services/CacheService';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleErrors, returnSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { conditionalRedirect, returnNextPage } from './helpers/RouterHelpers';

const logger = getLogger('TypeOfClaimController');

export default class TypeOfClaimController {
  private readonly form: Form;
  private readonly typeOfClaimFormContent: FormContent = {
    fields: {
      typeOfClaim: {
        id: 'typeOfClaim',
        type: 'checkboxes',
        labelHidden: false,
        label: l => l.h1,
        labelSize: 'xl',
        isPageHeading: true,
        hint: l => l.hint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'breachOfContract',
            name: 'typeOfClaim',
            label: l => l.breachOfContract.checkbox,
            value: TypesOfClaim.BREACH_OF_CONTRACT,
          },
          {
            id: 'discrimination',
            name: 'typeOfClaim',
            label: l => l.discrimination.checkbox,
            value: TypesOfClaim.DISCRIMINATION,
            hint: h => h.discrimination.hint,
          },
          {
            id: 'payRelatedClaim',
            name: 'typeOfClaim',
            label: l => l.payRelated.checkbox,
            value: TypesOfClaim.PAY_RELATED_CLAIM,
          },
          {
            id: 'unfairDismissal',
            name: 'typeOfClaim',
            label: l => l.unfairDismissal.checkbox,
            value: TypesOfClaim.UNFAIR_DISMISSAL,
            hint: h => h.unfairDismissal.hint,
          },
          {
            id: 'whistleBlowing',
            name: 'typeOfClaim',
            label: l => l.whistleBlowing.checkbox,
            value: TypesOfClaim.WHISTLE_BLOWING,
            hint: h => h.whistleBlowing.hint,
          },
          {
            id: 'otherTypes',
            name: 'typeOfClaim',
            label: l => l.otherTypesOfClaims.checkbox,
            subFields: {
              otherClaim: {
                id: 'otherTypesOfClaims',
                type: 'charactercount',
                classes: 'govuk-label',
                label: l => l.otherTypesOfClaims.explain,
                labelSize: 'normal',
                labelHidden: false,
                maxlength: 100,
              },
            },
            value: 'otherTypesOfClaims',
          },
        ],
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.typeOfClaimFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    const errors = returnSessionErrors(req, this.form);
    if (errors.length === 0) {
      let redirectUrl;
      if (
        conditionalRedirect(req, this.form.getFormFields(), [TypesOfClaim.DISCRIMINATION]) ||
        conditionalRedirect(req, this.form.getFormFields(), [TypesOfClaim.WHISTLE_BLOWING])
      ) {
        redirectUrl = PageUrls.CLAIM_STEPS;
      } else {
        const url: string = process.env.ET1_BASE_URL ?? config.get('services.et1Legacy.url');
        redirectUrl = `${url}`;
      }
      if (req.app?.locals) {
        const redisClient = req.app.locals?.redisClient;
        if (redisClient) {
          const cacheMap = new Map<CaseDataCacheKey, string>([
            [CaseDataCacheKey.POSTCODE, req.session.userCase?.workPostcode],
            [CaseDataCacheKey.CLAIMANT_REPRESENTED, req.session.userCase?.claimantRepresentedQuestion],
            [CaseDataCacheKey.CASE_TYPE, req.session.userCase?.caseType],
            [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify(req.session.userCase?.typeOfClaim)],
            [CaseDataCacheKey.OTHER_CLAIM_TYPE, req.session.userCase?.otherClaim],
            [CaseDataCacheKey.ACAS_MULTIPLE, req.session.userCase?.acasMultiple],
            [CaseDataCacheKey.VALID_NO_ACAS_REASON, req.session.userCase?.validNoAcasReason],
          ]);
          try {
            req.session.guid = cachePreloginCaseData(redisClient, cacheMap);
          } catch (err) {
            const error = new Error(err.message);
            error.name = RedisErrors.FAILED_TO_SAVE;
            if (err.stack) {
              error.stack = err.stack;
            }
            throw error;
          }
        } else {
          const err = new Error(RedisErrors.CLIENT_NOT_FOUND);
          err.name = RedisErrors.FAILED_TO_CONNECT;
          throw err;
        }
      }
      // Only called when returning from CYA page
      if (req.session.userCase.id) {
        await handleUpdateDraftCase(req, logger);
      }
      redirectUrl = setUrlLanguage(req, redirectUrl);
      returnNextPage(req, res, redirectUrl);
    } else {
      handleErrors(req, res, errors);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.typeOfClaimFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TYPE_OF_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TYPE_OF_CLAIM, {
      ...content,
      redisError: req.app?.get(RedisErrors.REDIS_ERROR),
    });
  };
}
