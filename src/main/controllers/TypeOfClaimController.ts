import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseDataCacheKey } from '../definitions/case';
import { AuthUrls, LegacyUrls, RedisErrors, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { cachePreloginCaseData } from '../services/CacheService';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

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

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), [TypesOfClaim.BREACH_OF_CONTRACT])
      ? LegacyUrls.ET1_BASE
      : AuthUrls.LOGIN;

    setUserCase(req, this.form);

    if (req.app?.locals) {
      const redisClient = req.app.locals?.redisClient;
      if (redisClient) {
        const cacheMap = new Map<CaseDataCacheKey, string>([
          [CaseDataCacheKey.CLAIMANT_REPRESENTED, JSON.stringify(req.session.userCase?.claimantRepresentedQuestion)],
          [CaseDataCacheKey.CASE_TYPE, JSON.stringify(req.session.userCase?.caseType)],
          [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify(req.session.userCase?.typeOfClaim)],
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

    handleSessionErrors(req, res, this.form, redirectUrl);
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
