import { Response } from 'express';

import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import UpdatePreferenceController from '../UpdatePreferenceController';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

export default class RepresentativeCommsPrefController extends UpdatePreferenceController {
  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const { caseTypeId } = req.session.userCase;
    const content = getPageContent(req, this.getFormContent(caseTypeId), [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTATIVE_COMMS_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.getForm(caseTypeId).getFormFields());
    res.render(TranslationKeys.UPDATE_PREFERENCE, {
      ...content,
    });
  };
}
