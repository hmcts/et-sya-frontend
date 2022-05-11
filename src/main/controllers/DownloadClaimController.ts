import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

export default class DownloadClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      const response = await getCaseApi(req.session.user?.accessToken).downloadClaimPdf('1234');

      if (response.status === 200) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=submitted-claim.pdf');
        res.status(200).send(Buffer.from(response.data, 'binary'));
      } else {
        // redirect to a file-not-found page
      }
    } catch (error) {
      logger.info(error);
      if (error.response) {
        logger.info(error.response.status, error.response.data);
      }
    }
  }
}
