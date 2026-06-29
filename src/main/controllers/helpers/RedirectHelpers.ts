import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { languages } from '../../definitions/constants';
import { Logger } from '../../logger';
import { RedisUtils } from '../../utils/RedisUtils';

import { handleUpdateDraftCase, setUserCase } from './CaseHelpers';
import { returnSessionErrors } from './ErrorHelpers';
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
    // Inline ternary: all branches are constants so Fortify cannot trace taint from req.url to res.redirect
    const langParam = req.url?.includes(languages.WELSH_URL_PARAMETER)
      ? languages.WELSH_URL_PARAMETER
      : req.url?.includes(languages.ENGLISH_URL_PARAMETER)
      ? languages.ENGLISH_URL_PARAMETER
      : '';
    if (req.url?.includes(languages.WELSH_URL_PARAMETER)) {
      req.session.lang = languages.WELSH;
    } else if (req.url?.includes(languages.ENGLISH_URL_PARAMETER)) {
      req.session.lang = languages.ENGLISH;
    }
    returnNextPage(req, res, redirectUrl + langParam);
  }
};
