import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors } from './helpers';

const pageElements = [
  {
    title: (l: AnyRecord): string => l.title,
    subTitle: (l: AnyRecord): string => l.subTitle,
    links: [
      {
        url: PageUrls.RESPONDENT_NAME,
        linkTxt: (l: AnyRecord): string => l.name,
      },
      {
        url: PageUrls.RESPONDENT_ADDRESS,
        linkTxt: (l: AnyRecord): string => l.address,
      },
      {
        url: PageUrls.ACAS_CERT_NUM,
        linkTxt: (l: AnyRecord): string => l.acasNum,
      },
    ],
  },
];

export default class RespondentDetailsCheckController {
  private readonly form: Form;
  private readonly addRespondentForm: FormContent = {
    fields: {},
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.addRespondentForm.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    console.log('Here we go');
    const respondents = req.session.userCase.respondents;

    if (respondents.length < 6) {
      const newRespondentNum = respondents.length + 1;
      const newRespondent = {
        respondentNumber: newRespondentNum,
      };
      req.session.userCase.respondents.push(newRespondent);
      req.session.userCase.selectedRespondent = newRespondentNum;
    } else {
      // TODO Error handling
      console.log('Limit reached');
    }

    handleSessionErrors(req, res, this.form, PageUrls.RESPONDENT_NAME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.addRespondentForm, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_DETAILS_CHECK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_DETAILS_CHECK, {
      ...content,
      pageElements,
    });
  };
}
