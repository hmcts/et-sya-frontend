import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentDetail, TellUsWhatYouWant, TypesOfClaim } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { getDocId } from '../helper/ApiFormatter';

import { getEmploymentDetails } from './helpers/EmploymentAnswersHelper';
import { getRespondentSection } from './helpers/RespondentAnswersHelper';
import { getYourDetails } from './helpers/YourDetailsAnswersHelper';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('ClaimDetailsController');

export default class ClaimDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;

    if (!userCase) {
      logger.error('A userCase was not found');
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    userCase.allEt1DocumentDetails = await getET1Documents(userCase);

    const et1Documents = [];
    for (const doc of userCase.allEt1DocumentDetails) {
      et1Documents.push({
        id: doc.id,
        name: doc.type === 'ET1' ? 'ET1 Form' : 'ET1 support document',
      });
    }

    // Because these translations don't have the CYA 'change' translation, they don't show the change action.
    // However, this is just a quick fix to make it look like a table rather than the summary details that it actually is.
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
    };

    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      PageUrls,
      userCase,
      hideContactUs: true,
      yourDetails: getYourDetails(userCase, translations),
      employmentSection: getEmploymentDetails(userCase, translations),
      translations,
      getRespondentSection,
      showCompensationRequest: !!userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY),
      showTribunalRequest: !!userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION),
      showWhistleBlowingRequest: !!userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING),
      et1Documents,
    });
  };
}

async function getET1Documents(userCase: CaseWithId) {
  const et1DocumentDetails = [];

  if (userCase.et1SubmittedForm) {
    et1DocumentDetails.push(userCase.et1SubmittedForm);
  }

  if (userCase.claimSummaryFile?.document_url) {
    et1DocumentDetails.push({
      id: getDocId(userCase.claimSummaryFile.document_url),
    } as DocumentDetail);
  }

  return et1DocumentDetails;
}
