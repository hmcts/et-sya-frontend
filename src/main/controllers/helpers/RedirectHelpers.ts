import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { Logger } from '../../logger';
import { RedisUtils } from '../../utils/RedisUtils';

import { handleUpdateDraftCase, setUserCase } from './CaseHelpers';
import { returnSessionErrors } from './ErrorHelpers';
import { setUrlLanguage } from './LanguageHelper';
import { returnNextPage } from './RouterHelpers';

export const handleClaimStepsRedirect = async (
  req: AppRequest,
  res: Response,
  form: Form,
  redirectUrl: string,
  logger: Logger
): Promise<void> => {
  setUserCase(req, form);
  const errors = returnSessionErrors(req, form);
  if (errors.length === 0) {
    if (req.app?.locals) {
      await RedisUtils.cacheUserCaseData(req);
    }
    if (req.session.userCase.id) {
      await handleUpdateDraftCase(req, logger);
    }
    const redirectUrlWithLang = setUrlLanguage(req, redirectUrl);
    returnNextPage(req, res, redirectUrlWithLang);
  }
};
