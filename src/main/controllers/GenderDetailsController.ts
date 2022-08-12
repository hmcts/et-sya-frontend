import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { isFieldFilledIn, isOptionSelected } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { GenderTitle, Sex, YesOrNoOrPreferNot } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, handleUpdateDraftCase, setUserCase } from './helpers';

export default class GenderDetailsController {
  private readonly form: Form;
  private readonly genderDetailsContent: FormContent = {
    fields: {
      claimantSex: {
        classes: 'govuk-radios govuk-!-margin-bottom-6',
        id: 'gender',
        type: 'radios',
        labelSize: 's',
        label: (l: AnyRecord): string => l.sex,
        values: [
          {
            label: (l: AnyRecord): string => l.female,
            value: Sex.FEMALE,
          },
          {
            label: (l: AnyRecord): string => l.male,
            value: Sex.MALE,
          },
          {
            label: (l: AnyRecord): string => l.genderTitle.preferNotToSay,
            value: Sex.PREFER_NOT_TO_SAY,
          },
        ],
        validator: isFieldFilledIn,
      },
      claimantGenderIdentitySame: {
        classes: 'govuk-radios govuk-!-margin-bottom-6',
        id: 'genderIdentitySame',
        type: 'radios',
        labelSize: 's',
        label: (l: AnyRecord): string => l.genderIdentitySame,
        hint: (l: AnyRecord): string => l.genderIdentitySameHint,
        values: [
          {
            label: l => l.yes,
            value: YesOrNoOrPreferNot.YES,
          },
          {
            label: l => l.no,
            value: YesOrNoOrPreferNot.NO,
            subFields: {
              claimantGenderIdentity: {
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
            value: YesOrNoOrPreferNot.PREFER_NOT,
          },
        ],
      },
      preferredTitle: {
        id: 'preferredTitle',
        type: 'option',
        label: (l: AnyRecord): string => l.preferredTitle,
        labelSize: 's',
        values: [
          {
            value: 'notSelected',
            label: (l: AnyRecord): string => l.genderTitle.notSelected,
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
          },
          {
            value: GenderTitle.PREFER_NOT_TO_SAY,
            label: (l: AnyRecord): string => l.genderTitle.preferNotToSay,
          },
        ],
        validator: isOptionSelected,
      },
      otherTitlePreference: {
        id: 'otherTitlePreference',
        type: 'text',
        classes: 'govuk-input--width-10',
        label: (l: AnyRecord) => l.otherTitlePreference,
        labelSize: 's',
        attributes: { maxLength: 20 },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.genderDetailsContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.ADDRESS_DETAILS);
    handleUpdateDraftCase(req, this.logger);
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
