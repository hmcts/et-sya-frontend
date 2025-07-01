import { Response } from 'express';

import { getAddressesForPostcode } from '../address';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import {
  checkCaseStateAndRedirect,
  convertJsonArrayToTitleCase,
  handlePostLogicForRespondent,
} from './helpers/CaseHelpers';
import { assignAddresses, assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentRedirectUrl } from './helpers/RespondentHelpers';
import { getSelectTitle, getWorkAddressTypes } from './helpers/WorkPostCodeHelper';

const logger = getLogger('WorkPostCodeSelectController');

export default class WorkPostCodeSelectController {
  private readonly form: Form;
  private readonly postCodeSelectContent: FormContent = {
    fields: {
      workAddressTypes: {
        type: 'option',
        classes: 'govuk-select',
        id: 'workAddressTypes',
        label: l => l.selectAddress,
        labelSize: 'xl',
        isPageHeading: true,
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
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    const response = convertJsonArrayToTitleCase(await getAddressesForPostcode(req.session.userCase.workEnterPostcode));
    req.session.userCase.workAddresses = response;
    req.session.userCase.workAddressTypes = getWorkAddressTypes(response, req);
    const content = getPageContent(req, this.postCodeSelectContent, [TranslationKeys.COMMON]);
    assignAddresses(req.session.userCase, this.form.getFormFields());
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_POSTCODE_SELECT, {
      ...content,
      link: getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK),
      title: getSelectTitle(req),
    });
  };
}
