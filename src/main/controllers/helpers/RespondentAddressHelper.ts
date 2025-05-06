import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent } from '../../definitions/form';
import { getLogger } from '../../logger';

import { handlePostLogicForRespondent } from './CaseHelpers';
import { assignFormData, getPageContent } from './FormHelpers';
import { fillRespondentAddressFields, getRespondentIndex, getRespondentRedirectUrl } from './RespondentHelpers';

const logger = getLogger('RespondentAddressHelper');

export class RespondentAddressHelper {
  static async handlePost(req: AppRequest, res: Response, form: Form, nextPage: string): Promise<void> {
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, nextPage);
    await handlePostLogicForRespondent(req, res, form, logger, redirectUrl);
  }

  static handleGet(req: AppRequest, res: Response, form: Form, content: FormContent, translationKeys: string[]): void {
    const respondents = req.session.userCase.respondents;
    const respondentIndex = getRespondentIndex(req);
    const selectedRespondent = respondents[respondentIndex];
    const pageContent = getPageContent(req, content, translationKeys, respondentIndex);
    const respondentAddressTypes = req.session.userCase.respondentAddressTypes;

    if (respondentAddressTypes !== undefined) {
      fillRespondentAddressFields(respondentAddressTypes, req.session.userCase);
    }

    assignFormData(req.session.userCase, form.getFormFields());
    res.render(translationKeys[1], {
      ...pageContent,
      respondentName: selectedRespondent.respondentName,
      previousPostcode: selectedRespondent.respondentAddressPostcode,
    });
  }
}
