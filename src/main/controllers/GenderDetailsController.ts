import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
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
        classes: 'govuk-radios',
        id: 'gender',
        type: 'radios',
        label: (l: AnyRecord): string => l.sex,
        values: [
          {
            label: (l: AnyRecord): string => l.female,
            name: 'radio1',
            value: 'Female',
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.male,
            name: 'radio2',
            value: 'Male',
            attributes: { maxLength: 2 },
          },
        ],
        validator: isFieldFilledIn,
      },
      genderIdentitySame: {
        classes: 'govuk-radios',
        id: 'genderIdentitySame',
        type: 'radios',
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
                hint: (l: AnyRecord): string => l.hint,
                attributes: { maxLength: 2500 },
              },
            },
          },
        ],
        validator: isFieldFilledIn,
      },
      preferredTitle: {
        classes: 'govuk-radios',
        id: 'preferredTitle',
        type: 'option',
        label: (l: AnyRecord): string => l.preferredTitle,
        values: [
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
          },
          {
            value: GenderTitle.PREFER_NOT_TO_SAY,
            label: (l: AnyRecord): string => l.genderTitle.preferNotToSay,
          },
        ],
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
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.ADDRESS_DETAILS);
    console.log('req.session', req.session);
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
