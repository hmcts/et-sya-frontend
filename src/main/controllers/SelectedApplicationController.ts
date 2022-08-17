import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { selectUserCase } from '../services/CaseSelectionService';

export default class SelectedApplicationController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    await selectUserCase(req, res, req.params.caseId);
  };
}
