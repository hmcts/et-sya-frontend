import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { DefaultInlineRadioFormFields, saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import {
  assignFormData,
  conditionalRedirect,
  getPageContent,
  getRespondentIndex,
  getRespondentRedirectUrl,
  handleSessionErrors,
  setUserCase,
  updateWorkAddress,
} from './helpers';

export default class WorkAddressController {
  private readonly form: Form;
  private readonly workAddressFormContent: FormContent = {
    fields: {
      claimantWorkAddressQuestion: {
        ...DefaultInlineRadioFormFields,
        hint: (l: AnyRecord): string => l.hintText,
        id: 'work-address',
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.workAddressFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.ACAS_CERT_NUM)
      : getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.PLACE_OF_WORK);
    if (YesOrNo.YES) {
      const respondentIndex = getRespondentIndex(req);
      updateWorkAddress(req.session.userCase, req.session.userCase.respondents[respondentIndex]);
    }
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const respondentIndex = getRespondentIndex(req);
    const addressLine = req.session.userCase.respondents[respondentIndex].respondentAddress1;
    const content = getPageContent(req, this.workAddressFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WORK_ADDRESS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WORK_ADDRESS, {
      ...content,
      addressLine,
    });
  };
}
