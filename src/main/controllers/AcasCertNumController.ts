import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class AcasCertNumController {
  private readonly form: Form;

  private readonly acasCertNumContent: FormContent = {
    fields: {
      acasCert: {
        classes: 'govuk-radios',
        id: 'acasCert',
        type: 'radios',
        label: (l: AnyRecord): string => l.h1,
        isPageHeading: true,
        values: [
          {
            name: 'acasCertNum',
            label: YesOrNo.YES,
            value: YesOrNo.YES,
            subFields: {
              acasCertNum: {
                id: 'acasCertNum',
                name: 'acasCertNum',
                type: 'text',
                label: (l: AnyRecord): string => l.acasCertNum,
                classes: 'govuk-textarea',
                attributes: { maxLength: 20 },
              },
            },
          },
          {
            name: 'acasCertNum',
            label: YesOrNo.NO,
            value: YesOrNo.NO,
          },
        ],
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
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasCertNumContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ACAS_CERT_NUM,
    ]);
    const respondents = req.session.userCase.respondents;
    const currentRespondentName = respondents[respondents.length - 1].respondentName;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_CERT_NUM, {
      ...content,
      respondentName: currentRespondentName,
    });
  };
}
