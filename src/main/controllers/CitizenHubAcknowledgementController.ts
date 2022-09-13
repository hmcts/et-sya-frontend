import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getCaseApi } from '../services/CaseService';

export default class CitizenHubAcknowledgementController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    interface DocumentDetails {
      size: string;
      mimeType: string;
      originalDocumentName: string;
      createdOn: string;
      description: string;
      id: string;
    }
    const acknowledgeDocs: DocumentDetails[] = [];
    try {
      if (!req.session?.userCase?.acknowledgementOfClaimLetterDetail?.length) {
        return res.redirect('/citizen-hub/' + req.session?.userCase?.id);
      }
      console.log('before await');
      for await (const document of req.session.userCase.acknowledgementOfClaimLetterDetail) {
        const docDetails = await getCaseApi(req.session.user?.accessToken).getDocumentDetails(document.id);
        const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;

        acknowledgeDocs.push({
          size: (size / 1000000).toFixed(3),
          mimeType,
          originalDocumentName,
          createdOn: new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'long',
          }).format(new Date(createdOn)),
          description: document.description,
          id: document.id,
        });
      }
      console.log('docs is ', acknowledgeDocs);
    } catch (error) {
      console.log('error on acknowledge page', error);
      return res.redirect('/not-found');
    }
    console.log('about to call res.render now ...');
    res.render(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t('acknowledgement-of-claim', { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      hideContactUs: true,
      acknowledgeDocs,
    });
  };
}
