import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address_validator';
import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('PostCodeEnterController');

export default class PostCodeEnterController {
  private readonly form: Form;

  private readonly postCodeContent: FormContent = {
    fields: {
      enterPostcode: {
        id: 'enterPostcode',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.enterPostcode,
        labelSize: null,
        attributes: {
          maxLength: 14,
          autocomplete: 'postal-code',
        },
        validator: isValidUKPostcode,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.postCodeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.POSTCODE_SELECT);
  };

  // public post1(req: AppRequest<UnknownRecord>, res: Response): Promise<void> {
  //   const stubbedPostcode = this.checkStubbedPostcode(req.session.userCase.addressPostcode);
  //   if (!stubbedPostcode) {
  //     const a = getAddressesForPostcode(req.session.userCase.addressPostcode);
  //   }
  //
  //   await handlePostLogic(req, res, this.form, logger, PageUrls.PLACE_OF_WORK);
  //   // const { saveForLater } = req.body;
  //   //
  //   // if (saveForLater) {
  //   //   handleSaveAsDraft(res);
  //   // } else {
  //   //   const postcode = req.body.postcode as string;
  //   //
  //   //   const stubbedPostcode = this.checkStubbedPostcode(postcode);
  //   //   if (stubbedPostcode) {
  //   //     res.json(stubbedPostcode);
  //   //     return;
  //   //   }
  //   //
  //   //   res.json(await getAddressesForPostcode(postcode));
  //   // }
  // }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.postCodeContent, [TranslationKeys.COMMON, TranslationKeys.POSTCODE_ENTER]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.POSTCODE_ENTER, {
      ...content,
    });
  };
}
