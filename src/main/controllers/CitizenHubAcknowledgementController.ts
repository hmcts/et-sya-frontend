import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getCaseApi } from '../services/CaseService';

export default class CitizenHubAcknowledgementController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    interface DocumentDetails {
      size: number;
      mimeType: string;
      originalDocumentName: string;
      createdOn: string;
    }
    let retrievedDoc: DocumentDetails;
    try {
      const docDetails = await getCaseApi(req.session.user?.accessToken).getDocumentDetails(
        req.session.userCase.acknowledgementOfClaimLetterDetail.id
      );
      const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;
      const date = new Date(createdOn);
      const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      });
      const readableDate = dateTimeFormat.format(date);
      retrievedDoc = {
        size,
        mimeType,
        originalDocumentName,
        createdOn: readableDate,
      };
    } catch (error) {
      return res.redirect('/not-found');
    }
    res.render(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t('acknowledgement-of-claim', { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      hideContactUs: true,
      retrievedDoc,
      shortDesc: req.session.userCase.acknowledgementOfClaimLetterDetail.description,
    });
  };
}
