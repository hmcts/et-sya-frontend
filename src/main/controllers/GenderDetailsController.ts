import { Response } from 'express';

import { Form } from '../components/form/form';
import { validateGenderTitle, validatePreferredOther } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { GenderTitle, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class GenderDetailsController {
  private readonly form: Form;
  private readonly genderDetailsContent: FormContent = {
    fields: {
      gender: {
        classes: 'govuk-radios govuk-!-margin-bottom-6',
        id: 'gender',
        type: 'radios',
        labelSize: 's',
        label: (l: AnyRecord): string => l.sex,
        values: [
          {
            label: (l: AnyRecord): string => l.female,
            value: 'Female',
          },
          {
            label: (l: AnyRecord): string => l.male,
            value: 'Male',
          },
          {
            label: (l: AnyRecord): string => l.genderTitle.preferNotToSay,
            value: 'Prefer not to say',
          },
        ],
      },
      genderIdentitySame: {
        classes: 'govuk-radios govuk-!-margin-bottom-6',
        id: 'genderIdentitySame',
        type: 'radios',
        labelSize: 's',
        label: (l: AnyRecord): string => l.genderIdentity,
        hint: (l: AnyRecord): string => l.genderIdentityHint,
        values: [
          {
            label: l => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: l => l.no,
            value: YesOrNo.NO,
            subFields: {
              genderIdentity: {
                id: 'genderIdentityText',
                name: 'genderIdentityText',
                type: 'text',
                label: (l: AnyRecord): string => l.genderIdentityTextLabel,
                classes: 'govuk-input--width-10',
                labelSize: 's',
                attributes: { maxLength: 2500 },
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.genderTitle.preferNotToSay,
            value: 'Prefer not to say',
          },
        ],
      },
      preferredTitles: {
        id: 'preferredTitle',
        type: 'option',
        label: (l: AnyRecord): string => l.preferredTitle,
        labelSize: 's',
        values: [
          {
            value: 'pleaseSelect',
            label: (l: AnyRecord): string => l.genderTitle.pleaseSelect,
          },
          {
            value: GenderTitle.MR,
            label: (l: AnyRecord): string => l.genderTitle.mr,
          },
          {
            value: GenderTitle.MRS,
            label: (l: AnyRecord): string => l.genderTitle.mrs,
          },
          {
            value: GenderTitle.MISS,
            label: (l: AnyRecord): string => l.genderTitle.miss,
          },
          {
            value: GenderTitle.MS,
            label: (l: AnyRecord): string => l.genderTitle.ms,
          },
          {
            value: GenderTitle.MX,
            label: (l: AnyRecord): string => l.genderTitle.mx,
          },
          {
            value: GenderTitle.OTHER,
            label: (l: AnyRecord): string => l.genderTitle.other,
            validator: validateGenderTitle,
          },
          {
            value: GenderTitle.PREFER_NOT_TO_SAY,
            label: (l: AnyRecord): string => l.genderTitle.preferNotToSay,
          },
        ],
      },
      otherTitlePreference: {
        id: 'otherTitlePreference',
        type: 'text',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord) => l.otherTitlePreference,
        labelSize: 's',
        value: '',
        validator: validatePreferredOther,
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
    this.form = new Form(<FormFields>this.genderDetailsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    if (req.body.preferredTitle === 'other' && !req.body.otherTitlePreference) {
      console.log('=======ERRRRORRRRRRRR==========');
    }
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.ADDRESS_DETAILS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.genderDetailsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.GENDER_DETAILS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.GENDER_DETAILS, {
      ...content,
    });
  };
}
