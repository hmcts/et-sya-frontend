import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class TravelController {
  private readonly form: Form;
  private readonly travelContent: FormContent = {
    fields: {
      travel: {
        id: 'travel',
        type: 'checkboxes',
        labelHidden: false,
        label: l => l.h1,
        labelSize: 'l',
        hint: l => l.hint,
        isPageHeading: true,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'travel',
            label: l => l.checkbox1,
            value: 'taxi',
            subFields: {
              travelTaxiExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.explain,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'travel',
            label: l => l.checkbox2,
            value: 'closeParking',
            subFields: {
              travelCloseParkingExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.explain,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'travel',
            label: l => l.checkbox3,
            value: 'wheelchairAccess',
          },
          {
            name: 'travel',
            label: l => l.checkbox4,
            value: 'venueWheelchair',
          },
          {
            name: 'travel',
            label: l => l.checkbox5,
            value: 'accessibleToilet',
          },
          {
            name: 'travel',
            label: l => l.checkbox6,
            value: 'helpUsingLift',
          },
          {
            name: 'travel',
            label: l => l.checkbox7,
            value: 'differentTypeOfChair',
            subFields: {
              travelDifferentTypeOfChairExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                hint: l => l.checkboxTextarea7Hint,
                labelSize: 'normal',
              },
            },
          },
          {
            name: 'travel',
            label: l => l.checkbox8,
            value: 'guidingInBuilding',
          },
          {
            name: 'travel',
            label: l => l.other,
            value: 'other',
            subFields: {
              travelOtherExplanation: {
                type: 'textarea',
                classes: 'govuk-input--width-10',
                label: l => l.describe,
                labelSize: 'normal',
              },
            },
          },
          {
            divider: true,
          },
          {
            name: 'travel',
            label: l => l.notNeeded,
            value: 'notNeeded',
            exclusive: true,
          },
        ],
      },
    },
    submit: {
      text: l => l.submit,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.travelContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.travelContent, [TranslationKeys.COMMON, TranslationKeys.TRAVEL]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
