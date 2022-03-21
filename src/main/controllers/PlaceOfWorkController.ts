import { Response } from 'express';

import { Form } from '../components/form/form';
import { isInvalidPostcode, isWorkAddressLineOneValid, isWorkAddressTownValid } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { StillWorking } from '../definitions/case';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class PlaceOfWorkController {
  private readonly form: Form;
  private readonly placeOfWorkContent: FormContent = {
    fields: {
      workAddress1: {
        id: 'address1',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.buildingStreet,
        labelSize: null,
        validator: isWorkAddressLineOneValid,
      },
      workAddress2: {
        id: 'address2',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: null,
        labelSize: null,
        labelHidden: true,
      },
      workAddressTown: {
        id: 'addressTown',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.town,
        labelSize: null,
        validator: isWorkAddressTownValid,
      },
      workAddressCounty: {
        id: 'addressCounty',
        type: 'text',
        classes: 'govuk-label govuk-!-width-one-half',
        label: l => l.county,
        labelSize: null,
      },
      workAddressPostcode: {
        id: 'addressPostcode',
        type: 'text',
        classes: 'govuk-label govuk-input--width-10',
        label: l => l.postcode,
        labelSize: null,
        attributes: {
          maxLength: 14,
        },
        validator: isInvalidPostcode,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2 hidden',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary hidden',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.placeOfWorkContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    let stillWorking = true;
    if (req.session.userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      stillWorking = false;
    }

    const content = getPageContent(req, this.placeOfWorkContent, ['common', 'enter-address', 'place-of-work']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('place-of-work', {
      ...content,
      stillWorking,
    });
  };
}
