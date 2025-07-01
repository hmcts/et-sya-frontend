import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentIndex, getRespondentRedirectUrl } from './helpers/RespondentHelpers';
import { conditionalRedirect } from './helpers/RouterHelpers';

const logger = getLogger('AcasCertNumController');

export default class AcasCertNumController {
  private readonly form: Form;

  private readonly acasCertNumContent: FormContent = {
    fields: {
      acasCert: {
        classes: 'govuk-radios',
        id: 'acasCert',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'l',
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
                labelAsHint: true,
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

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      redirectUrl = req.session.respondentRedirectCheckAnswer
        ? PageUrls.CHECK_ANSWERS
        : PageUrls.RESPONDENT_DETAILS_CHECK;
    } else if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      req.session.returnUrl = undefined;
      redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.NO_ACAS_NUMBER);
    } else {
      redirectUrl = PageUrls.ACAS_CERT_NUM;
    }
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    const respondents = req.session.userCase.respondents;
    const respondentIndex = getRespondentIndex(req);
    const currentRespondentName = respondents[respondentIndex].respondentName;
    const content = getPageContent(
      req,
      this.acasCertNumContent,
      [TranslationKeys.COMMON, TranslationKeys.ACAS_CERT_NUM],
      respondentIndex
    );
    const acasCert = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    acasCert.label = (l: AnyRecord): string => l.legend + currentRespondentName + '?';
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_CERT_NUM, {
      ...content,
      respondentName: currentRespondentName,
    });
  };
}
