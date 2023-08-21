import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { getCaptionText, getTseApplicationDetailsTable } from './helpers/Rule92NotSystemUserHelper';

export default class CopiedCorrespondenceConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.COPIED_CORRESPONDENCE_CONFIRMATION, { returnObjects: true }),
    };

    res.render(TranslationKeys.COPIED_CORRESPONDENCE_CONFIRMATION, {
      ...translations,
      applicationType: getCaptionText(req),
      appContent: getTseApplicationDetailsTable(req),
      thisCorrespondenceLink: '#',
      thisCorrespondenceFileLink: '#',
      thisCorrespondenceFileName: '[file_name_of_supporting_doc]',
    });
  }
}
