import { AppRequest } from '../definitions/appRequest';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { Response } from 'express';

const logger = getLogger('DownloadClaimController');

export default class DownloadClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      const pdf = await getCaseApi(req.session.user?.accessToken).downloadClaimPdf(req.session.userCase?.id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=submitted-claim.pdf');
      res.status(200).send(Buffer.from(pdf.data, 'binary'));
    } catch (error) {
      logger.info(error.message);
      res.redirect('not-found');
    }
  }
}
