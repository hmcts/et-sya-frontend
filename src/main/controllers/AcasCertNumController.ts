import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import {
  assignFormData,
  conditionalRedirect,
  getPageContent,
  getRespondentIndex,
  getRespondentRedirectUrl,
  handleSaveAsDraft,
  handleSessionErrors,
  setUserCaseForRespondent,
} from './helpers';

export default class AcasCertNumController {
  private readonly form: Form;

  private readonly acasCertNumContent: FormContent = {
    fields: {
      acasCert: {
        classes: 'govuk-radios',
        id: 'acasCert',
        type: 'radios',
        values: [
          {
            name: 'acasCertNum',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              acasCertNum: {
                id: 'acasCertNum',
                name: 'acasCertNum',
                type: 'text',
                label: (l: AnyRecord): string => l.acasCertNum,
                classes: 'govuk-textarea',
                attributes: { maxLength: 13 },
              },
            },
          },
          {
            name: 'acasCertNum',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.acasCertNumContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const { saveForLater } = req.body;

    if (saveForLater) {
      handleSaveAsDraft(res);
    } else {
      let redirectUrl;
      setUserCaseForRespondent(req, this.form);
      if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
        redirectUrl = PageUrls.RESPONDENT_DETAILS_CHECK;
      } else if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
        req.session.returnUrl = undefined;
        redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.NO_ACAS_NUMBER);
      } else {
        redirectUrl = PageUrls.ACAS_CERT_NUM;
      }
      handleSessionErrors(req, res, this.form, redirectUrl);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const respondents = req.session.userCase.respondents;
    const respondentIndex = getRespondentIndex(req);
    const currentRespondentName = respondents[respondentIndex].respondentName;
    const content = getPageContent(
      req,
      this.acasCertNumContent,
      [TranslationKeys.COMMON, TranslationKeys.ACAS_CERT_NUM],
      respondentIndex
    );

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_CERT_NUM, {
      ...content,
      respondentName: currentRespondentName,
    });
  };
}
