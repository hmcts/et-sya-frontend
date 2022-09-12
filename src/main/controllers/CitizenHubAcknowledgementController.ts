import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getCaseApi } from '../services/CaseService';

export default class CitizenHubAcknowledgementController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    interface DocumentDetails {
      size: string;
      mimeType: string;
      originalDocumentName: string;
      createdOn: string;
      description: string;
    }
    const acknowledgeDocs: DocumentDetails[] = [];
    try {
      if (!req.session?.userCase?.acknowledgementOfClaimLetterDetail.length) {
        return res.redirect('/citizen-hub/' + req.session?.userCase?.id);
      }

      for await (const document of req.session.userCase.acknowledgementOfClaimLetterDetail) {
        const docDetails = await getCaseApi(req.session.user?.accessToken).getDocumentDetails(document.id);
        const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;
        const date = new Date(createdOn);
        const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long',
        });
        const readableDate = dateTimeFormat.format(date);
        acknowledgeDocs.push({
          size: (size / 1000000).toFixed(3),
          mimeType,
          originalDocumentName,
          createdOn: readableDate,
          description: document.description,
        });
      }
    } catch (error) {
      console.log('error on acknowledge page', error);
      return res.redirect('/not-found');
    }
    res.render(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t('acknowledgement-of-claim', { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      hideContactUs: true,
      acknowledgeDocs,
    });
  };
}
