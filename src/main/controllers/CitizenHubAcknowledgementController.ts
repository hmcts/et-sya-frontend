import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CitizenHubAcknowledgementController');

export default class CitizenHubAcknowledgementController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      if (!req.session?.userCase?.acknowledgementOfClaimLetterDetail?.length) {
        return res.redirect('/citizen-hub/' + req.session?.userCase?.id);
      }
      for await (const document of req.session.userCase.acknowledgementOfClaimLetterDetail) {
        const docDetails = await getCaseApi(req.session.user?.accessToken).getDocumentDetails(document.id);
        const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;
        const retrievedValues = {
          size: (size / 1000000).toFixed(3),
          mimeType,
          originalDocumentName,
          createdOn: new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'long',
          }).format(new Date(createdOn)),
          description: document.description,
        };
        Object.assign(
          req.session.userCase.acknowledgementOfClaimLetterDetail.find(doc => doc.id === document.id),
          retrievedValues
        );
      }
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err);
      return res.redirect('/not-found');
    }
    res.render(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      hideContactUs: true,
      acknowledgeDocs: req.session.userCase.acknowledgementOfClaimLetterDetail,
    });
  };
}
