import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, Rule92Types, ServiceErrors, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { SupportingMaterialYesNoRadioValues } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { setUserCase, updateSendNotificationState } from './helpers/CaseHelpers';
import { getResponseErrors } from './helpers/ErrorHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam, returnSafeRedirectUrl } from './helpers/RouterHelpers';
import { findSelectedSendNotification } from './helpers/StoredToSubmitHelpers';
import {
  determineRedirectUrl,
  getNotificationResponses,
  getTribunalOrderOrRequestDetails,
} from './helpers/TribunalOrderOrRequestDetailsHelper';

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
        values: SupportingMaterialYesNoRadioValues,
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
    const userCase = req.session.userCase;

    const selectedRequestOrOrder = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.orderId
    );
    if (selectedRequestOrOrder === undefined) {
      logger.error('Selected order not found');
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }

    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const error = getResponseErrors(formData);

    if (error) {
      req.session.errors = [];
      req.session.errors.push(error);
      const redirectUrl = PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace(
        ':orderId',
        selectedRequestOrOrder.id + getLanguageParam(req.url)
      );
      return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
    }
    req.session.errors = [];

    const redirectUrl = determineRedirectUrl(req, selectedRequestOrOrder);
    return res.redirect(returnSafeRedirectUrl(req, redirectUrl, logger));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session.userCase;
    req.session.contactType = Rule92Types.TRIBUNAL;
    req.session.visitedContactTribunalSelection = true;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.NOTIFICATION_SUBJECTS, { returnObjects: true }),
    };

    const content = getPageContent(req, this.respondToTribunalOrder, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.NOTIFICATION_SUBJECTS,
      TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER,
    ]);

    const selectedRequestOrOrder = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.orderId
    );
    if (!selectedRequestOrOrder) {
      logger.error(ServiceErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params?.orderId);
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }
    userCase.selectedRequestOrOrder = selectedRequestOrOrder;

    const responses = await getNotificationResponses(selectedRequestOrOrder.value, translations, req);

    try {
      await updateSendNotificationState(req, logger);
    } catch (error) {
      logger.info(error.message);
    }

    res.render(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, {
      ...content,
      cancelLink: `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`,
      orderOrRequestContent: getTribunalOrderOrRequestDetails(translations, selectedRequestOrOrder, req.url),
      welshEnabled,
      responses,
    });
  };
}
