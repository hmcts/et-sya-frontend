import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';
import localesCy from '../resources/locales/cy/translation/postcode-select.json';
import locales from '../resources/locales/en/translation/respondent-postcode-select.json';

import { convertJsonArrayToTitleCase, handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('WorkPostCodeSelectController');

export default class WorkPostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      workAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'workAddressTypes',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };
  constructor() {
    this.form = new Form(<FormFields>this.postCodeSelectContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const response = convertJsonArrayToTitleCase(await getAddressesForPostcode(req.session.userCase.workEnterPostcode));
    req.session.userCase.workAddresses = response;
    req.session.userCase.workAddressTypes = [];
    if (response.length > 0) {
      req.session.userCase.workAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSeveral : locales.selectDefaultSeveral,
      });
    } else if (response.length === 1) {
      req.session.userCase.workAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultSingle : locales.selectDefaultSingle,
      });
    } else {
      req.session.userCase.workAddressTypes.push({
        selected: true,
        label: req.url?.includes('lng=cy') ? localesCy.selectDefaultNone : locales.selectDefaultNone,
      });
    }
    for (const address of response) {
      req.session.userCase.workAddressTypes.push({
        value: response.indexOf(address),
        label: address.fullAddress,
      });
    }
    const content = getPageContent(req, this.postCodeSelectContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WORK_POSTCODE_SELECT,
    ]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    const link = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_POSTCODE_SELECT, {
      ...content,
      link,
    });
  };
}
