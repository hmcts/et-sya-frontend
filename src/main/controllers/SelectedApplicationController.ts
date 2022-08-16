import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { selectUserCase } from '../services/CaseSelectionService';

export default class SelectedApplicationController {
  public get = (req: AppRequest, res: Response): void => {
    selectUserCase(req, res, req.params.caseId);
  };
}
