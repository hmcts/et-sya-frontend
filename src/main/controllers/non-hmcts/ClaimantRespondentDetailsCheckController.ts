import { Response } from 'express';

import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';
import { getPageContent } from '../helpers/FormHelpers';
import { getClaimantRespondentDetailsSection } from '../helpers/RespondentAnswersHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class ClaimantRespondentDetailsCheckController {
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    return res.redirect(PageUrls.CLAIMANT_RESPONDENT_SECTION_CHECK);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase?.respondents ?? [];
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, { returnObjects: true }),
    };
    const content = getPageContent(req, { fields: {} }, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK,
    ]);
    res.render(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, {
      ...content,
      respondents,
      translations,
      getClaimantRespondentDetailsSection,
      PageUrls,
      languageParam: getLanguageParam(req.url),
    });
  };
}
