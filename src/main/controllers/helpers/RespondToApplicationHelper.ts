import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { ErrorPages, PageUrls, ServiceErrors } from '../../definitions/constants';
import { Logger } from '../../logger';

import { setUserCase } from './CaseHelpers';
import { findSelectedGenericTseApplication } from './DocumentHelpers';
import { getResponseErrors as getApplicationResponseError } from './ErrorHelpers';
import { copyToOtherPartyRedirectUrl } from './LinkHelpers';
import { getLanguageParam, returnSafeRedirectUrl } from './RouterHelpers';

export const handlePost = async (
  req: AppRequest,
  res: Response,
  form: Form,
  currentUrl: string,
  logger: Logger
): Promise<void> => {
  setUserCase(req, form);
  const languageParam = getLanguageParam(req.url);

  const selectedApplication = findSelectedGenericTseApplication(
    req.session.userCase.genericTseApplicationCollection,
    req.params?.appId
  );
  if (!selectedApplication) {
    logger.error(ServiceErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
    return res.redirect(ErrorPages.NOT_FOUND + languageParam);
  }

  const formData = form.getParsedBody(req.body, form.getFormFields());
  const error = getApplicationResponseError(formData);

  if (error) {
    req.session.errors = [];
    req.session.errors.push(error);
    const redirectUrl = currentUrl.replace(':appId', selectedApplication.id) + languageParam;
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  }

  req.session.errors = [];
  const redirectUrl =
    req.session.userCase.hasSupportingMaterial === YesOrNo.YES
      ? PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', selectedApplication.id) + languageParam
      : copyToOtherPartyRedirectUrl(req.session.userCase) + languageParam;
  return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
};
