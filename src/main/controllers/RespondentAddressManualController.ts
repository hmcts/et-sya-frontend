import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormFields } from '../definitions/form';
import enterAddressTranslations from '../resources/locales/en/translation/enter-address.json';

import { RespondentAddressHelper } from './helpers/RespondentAddressHelper';
import { createRespondentAddressContent } from './helpers/SharedFormContent';

export default class RespondentAddressManualController {
  private readonly form: Form;

  respondentAddressContent = createRespondentAddressContent(enterAddressTranslations.postcodeRequired);

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    const nextPage =
      userCase.respondents.length > 1 || userCase.pastEmployer === YesOrNo.NO
        ? PageUrls.ACAS_CERT_NUM
        : PageUrls.WORK_ADDRESS;
    await RespondentAddressHelper.handlePost(req, res, this.form, nextPage);
  };

  public get = (req: AppRequest, res: Response): void => {
    RespondentAddressHelper.handleGet(req, res, this.form, this.respondentAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ADDRESS_MANUAL,
      TranslationKeys.ENTER_ADDRESS,
    ]);
  };
}
