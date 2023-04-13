import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { setUserCase } from './helpers/CaseHelpers';
import { getApplicationResponseErrors as getApplicationResponseError } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getRepondentOrderOrRequestDetails } from './helpers/TribunalOrderOrRequestHelper';

export default class TribunalRespondToOrderController {
  private readonly form: Form;
  private readonly respondToTribunalOrder: FormContent = {
    fields: {
      respondToApplicationText: {
        id: 'respond-to-application-text',
        type: 'textarea',
        label: l => l.textInputLabel,
        labelHidden: false,
        labelSize: 'm',
        hint: l => l.textInputHint,
        attributes: { title: 'Response text area' },
        validator: isFieldFilledIn,
      },
      hasSupportingMaterial: {
        id: 'supporting-material-yes-no',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: l => l.radioButtonLabel,
        labelHidden: false,
        labelSize: 'm',
        hint: l => l.radioButtonHint,
        isPageHeading: true,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
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
    this.form = new Form(<FormFields>this.respondToTribunalOrder.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const error = getApplicationResponseError(formData);

    if (error) {
      req.session.errors = [];
      req.session.errors.push(error);
      return res.redirect(
        PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace('orderId', req.params.orderId + getLanguageParam(req.url))
      );
    }
    req.session.errors = [];
    return req.session.userCase.hasSupportingMaterial === YesOrNo.YES
      ? res.redirect(
          PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.orderId) + getLanguageParam(req.url)
        )
      : res.redirect(PageUrls.COPY_TO_OTHER_PARTY + getLanguageParam(req.url));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const content = getPageContent(req, this.respondToTribunalOrder, [
      TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
    ]);

    res.render(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, {
      ...content,
      cancelLink: `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`,
      orderOrRequestContent: getRepondentOrderOrRequestDetails(translations, userCase.selectedRequestOrOrder),
    });
  };
}
