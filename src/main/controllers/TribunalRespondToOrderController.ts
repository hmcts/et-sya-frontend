import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, Rule92Types, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { setUserCase } from './helpers/CaseHelpers';
import { getResponseErrors } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';
import { getRepondentOrderOrRequestDetails } from './helpers/TribunalOrderOrRequestHelper';

const logger = getLogger('TribunalRespondToOrderController');

export default class TribunalRespondToOrderController {
  private readonly form: Form;
  private readonly respondToTribunalOrder: FormContent = {
    fields: {
      responseText: {
        id: 'response-text',
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
    const error = getResponseErrors(formData);

    if (error) {
      req.session.errors = [];
      req.session.errors.push(error);
      const redirectUrl = PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace(
        ':orderId',
        req.params.orderId + getLanguageParam(req.url)
      );
      return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
    }
    req.session.errors = [];
    const redirectUrl =
      req.session.userCase.hasSupportingMaterial === YesOrNo.YES
        ? PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.orderId) + getLanguageParam(req.url)
        : PageUrls.COPY_TO_OTHER_PARTY + getLanguageParam(req.url);
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    req.session.contactType = Rule92Types.TRIBUNAL;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, { returnObjects: true }),
    };

    const content = getPageContent(req, this.respondToTribunalOrder, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER,
    ]);

    res.render(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, {
      ...content,
      cancelLink: `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`,
      orderOrRequestContent: getRepondentOrderOrRequestDetails(translations, userCase.selectedRequestOrOrder),
    });
  };
}
