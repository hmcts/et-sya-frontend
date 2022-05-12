import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

export default class DownloadClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      const token =
        'eyJraWQiOiIyMzQ1Njc4OSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJDQ0RfU3R1YiIsImlzcyI6Imh0dHA6XC9cL2ZyLWFtOjgwODBcL29wZW5hbVwvb2F1dGgyXC9obWN0cyIsInRva2VuTmFtZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTY1MTU5OTc2NiwiaWF0IjoxNjUxNTg1MzY2fQ.MKBgZpCaeGayzcJj3Pv6XJwcsXc4ZJj4n_-YuuNsLHA8Po6sTulieVERgUwMwIZ7uXdnJmmzbrnBoE-3OHfMxLXuK9a-_exAVY3to60VGSYXWgigoBSBIPyIN9CcYu16cFlFLFHVNn28A9KAfKna5UcdSvtJnk9Mt2NK1z8iRNp6fP9jOMVq3MFr5-qTE7--5SKLDpSCVw1ehd59GwtN0PAto07mZE8B_7tJxPOplIrvthn4Y5yTxvBFXsRb_jK0IccEQ_vMY0A9p_jUMRj0UcTEcFpga5mVtWGWTFYSob3RSHAmiX3RlQpUZKGa4EYEksiK-zU_E1c20ZBhj6Ejqw';
      const id = '1234';
      const response = await getCaseApi(req.session.user?.accessToken || token).downloadClaimPdf(
        req.session.userCase?.id || id
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=submitted-claim.pdf');
      res.status(200).send(Buffer.from(response.data, 'binary'));
    } catch (error) {
      logger.info(error);
      res.redirect('not-found');
    }
  }
}
