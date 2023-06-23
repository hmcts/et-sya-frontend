import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class RespondToTribunalResponseController {
  private readonly form: Form;
  private readonly respondToTribunalResponse: FormContent = {
    fields: {
      tribunalResponse: {
        id: 'tribunal_response',
        type: 'textarea',
        label: l => l.legend,
        labelSize: 'l',
        hint: l => l.hint,
        validator: isContent2500CharsOrLess,
      },
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondToTribunalResponse.fields);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.respondToTribunalResponse, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE, {
      ...content,
    });
  };
}
