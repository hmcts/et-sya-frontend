import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { AgreedDocuments } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { agreeingDocumentsForHearingErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class AgreeingDocumentsForHearingController {
  private readonly form: Form;

  private readonly agreeingDocumentsForHearingContent: FormContent = {
    fields: {
      bundlesRespondentAgreedDocWith: {
        classes: 'govuk-radios',
        id: 'bundlesRespondentAgreedDocWith',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            name: 'bundlesRespondentAgreedDocWith',
            label: (l: AnyRecord): string => l.yes,
            value: AgreedDocuments.YES,
          },
          {
            name: 'bundlesRespondentAgreedDocWith',
            label: (l: AnyRecord): string => l.agreed,
            value: AgreedDocuments.AGREEDBUT,
            subFields: {
              bundlesRespondentAgreedDocWithBut: {
                id: 'bundlesRespondentAgreedDocWithBut',
                name: 'bundlesRespondentAgreedDocWithBut',
                type: 'textarea',
                hint: (l: AnyRecord): string => l.agreedTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 2500 },
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'bundlesRespondentAgreedDocWith',
            label: (l: AnyRecord): string => l.notAgreed,
            value: AgreedDocuments.NOTAGREED,
            subFields: {
              bundlesRespondentAgreedDocWithNo: {
                id: 'bundlesRespondentAgreedDocWithNo',
                name: 'bundlesRespondentAgreedDocWithNo',
                type: 'textarea',
                hint: (l: AnyRecord): string => l.notAgreedTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 2500 },
                validator: isFieldFilledIn,
              },
            },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.agreeingDocumentsForHearingContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;

    const selectedRadio = req.body.bundlesRespondentAgreedDocWith;
    userCase.bundlesRespondentAgreedDocWith = selectedRadio;
    const agreedButText = req.body.bundlesRespondentAgreedDocWithBut;
    const notAgreedText = req.body.bundlesRespondentAgreedDocWithNo;

    switch (selectedRadio) {
      case AgreedDocuments.AGREEDBUT:
        userCase.bundlesRespondentAgreedDocWithBut = agreedButText;
        userCase.bundlesRespondentAgreedDocWithNo = undefined;
        break;
      case AgreedDocuments.NOTAGREED:
        userCase.bundlesRespondentAgreedDocWithNo = notAgreedText;
        userCase.bundlesRespondentAgreedDocWithBut = undefined;
        break;
      case AgreedDocuments.YES:
        userCase.bundlesRespondentAgreedDocWithNo = undefined;
        userCase.bundlesRespondentAgreedDocWithBut = undefined;
        break;
      default:
        req.session.errors = [];
        req.session.errors.push({ propertyName: 'bundlesRespondentAgreedDocWith', errorType: 'required' });
        return res.redirect(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
    }

    req.session.errors = agreeingDocumentsForHearingErrors(req);
    if (req.session?.errors?.length) {
      return res.redirect(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
    }
    return res.redirect(PageUrls.ABOUT_HEARING_DOCUMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session?.userCase;
    const content = getPageContent(req, this.agreeingDocumentsForHearingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.AGREEING_DOCUMENTS_FOR_HEARING,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.AGREEING_DOCUMENTS_FOR_HEARING, {
      ...content,
      cancelLink: `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`,
    });
  };
}
