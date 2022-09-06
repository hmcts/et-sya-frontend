import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
// import { getDocumentApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

export default class CaseDocumentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    console.log('anything');
    try {
      // const pdf = await  getDocumentApi(req.session.user?.accessToken).getCaseDocument();
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'attachment; filename=submitted-claim.pdf');
      // res.status(200).send(Buffer.from(pdf.data, 'binary'));
    } catch (error) {
      logger.info(error);
      res.redirect('not-found');
    }
  }
}
