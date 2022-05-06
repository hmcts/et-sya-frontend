import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

export default class DownloadClaimController {
  public get(req: AppRequest, res: Response): void {
    const token = 'add test token';

    getCaseApi(token)
      .downloadClaimPdf()
      .then(location => {
        if (location) {
          res.download(location);
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  }
}
