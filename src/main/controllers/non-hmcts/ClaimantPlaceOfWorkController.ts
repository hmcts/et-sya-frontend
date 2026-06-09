import { Response } from 'express';

import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
} from '../../components/form/address-validator';
import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { fillWorkAddressFields } from '../helpers/RespondentHelpers';

const logger = getLogger('ClaimantPlaceOfWorkController');

export default class ClaimantPlaceOfWorkController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      workAddress1: {
        id: 'address1',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine1,
        labelSize: null,
        attributes: { autocomplete: 'address-line1', maxLength: 150 },
        validator: isValidAddressFirstLine,
      },
      workAddress2: {
        id: 'address2',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.addressLine2,
        labelSize: null,
        attributes: { autocomplete: 'address-line2', maxLength: 50 },
        validator: isValidAddressSecondLine,
      },
      workAddressTown: {
        id: 'addressTown',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.town,
        labelSize: null,
        attributes: { autocomplete: 'address-level2', maxLength: 50 },
        validator: isValidCountryTownOrCity,
      },
      workAddressCountry: {
        id: 'addressCountry',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.country,
        labelSize: null,
        attributes: { maxLength: 50 },
        validator: isValidCountryTownOrCity,
      },
      workAddressPostcode: {
        id: 'addressPostcode',
        type: 'text',
        classes: 'govuk-label govuk-input--width-10',
        label: l => l.postcode,
        labelSize: null,
        attributes: { autocomplete: 'postal-code', maxLength: 14 },
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = req.body.saveForLater ? PageUrls.CLAIM_SAVED : PageUrls.CLAIMANT_ACAS_CERT_NUM;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const workAddressTypes = req.session.userCase.workAddressTypes;
    if (workAddressTypes !== undefined && req.session.userCase.workAddresses) {
      fillWorkAddressFields(workAddressTypes, req.session.userCase);
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ENTER_ADDRESS,
      TranslationKeys.CLAIMANT_PLACE_OF_WORK,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_PLACE_OF_WORK, { ...content });
  };
}
