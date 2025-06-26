import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';

import { combineDocuments, getDocumentDetails } from './helpers/DocumentHelpers';
import { getEmploymentDetails } from './helpers/EmploymentAnswersHelper';
import { populateAppItemsWithRedirectLinksCaptionsAndStatusColors } from './helpers/PageContentHelpers';
import { getRespondentSection } from './helpers/RespondentAnswersHelper';
import { setNumbersToRespondents } from './helpers/RespondentHelpers';
import { getYourDetails } from './helpers/YourDetailsAnswersHelper';

const logger = getLogger('ClaimDetailsController');

export default class ClaimDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;

    if (!userCase) {
      logger.error('A userCase was not found');
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }
    userCase.selectedGenericTseApplication = undefined;
    userCase.allEt1DocumentDetails = await getET1Documents(userCase, req.session.user?.accessToken);

    const et1Documents = [];
    for (const doc of userCase.allEt1DocumentDetails) {
      et1Documents.push({
        date: doc.createdOn,
        id: doc.id,
        name: doc.type === 'ET1' ? 'ET1 Form' : 'ET1 support document',
      });
    }

    setNumbersToRespondents(userCase.respondents);

    try {
      await getDocumentDetails(
        combineDocuments(userCase?.acknowledgementOfClaimLetterDetail, userCase?.rejectionOfClaimDocumentDetail),
        req.session.user?.accessToken
      );
    } catch (err) {
      logger.error(err.message);
    }

    // Because these translations don't have the CYA 'change' translation, they don't show the change action.
    // However, this is just a quick fix to make it look like a table rather than the summary details that it actually is.
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.ET1_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    };

    populateAppItemsWithRedirectLinksCaptionsAndStatusColors(
      userCase.genericTseApplicationCollection,
      req.url,
      translations
    );

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
      et1Documents,
    });
  };
}

async function getET1Documents(userCase: CaseWithId, accessToken: string) {
  const et1DocumentDetails = [];

  if (userCase.et1SubmittedForm) {
    et1DocumentDetails.push(userCase.et1SubmittedForm);
  }

  if (userCase.claimSummaryFile?.document_url) {
    const et1SupportId = getDocId(userCase.claimSummaryFile.document_url);
    const supportDocDetails = { id: et1SupportId, description: '' } as DocumentDetail;
    et1DocumentDetails.push(supportDocDetails);
  }

  try {
    await getDocumentDetails(et1DocumentDetails, accessToken);
  } catch (err) {
    logger.error(err.message);
  }

  return et1DocumentDetails;
}
