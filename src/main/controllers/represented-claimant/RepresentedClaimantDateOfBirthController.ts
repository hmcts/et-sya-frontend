import { Response } from 'express';

import { Form } from '../../components/form/form';
import { convertToDateObject } from '../../components/form/parser';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { CaseDate } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { BirthDateFormFields, DateFormFields } from '../../definitions/dates';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord, UnknownRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const representedClaimantDateOfBirthField: DateFormFields = {
  ...BirthDateFormFields,
  id: 'representedClaimantDateOfBirth',
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('representedClaimantDateOfBirth', body),
};

const logger = getLogger('RepresentedClaimantDateOfBirthController');

export default class RepresentedClaimantDateOfBirthController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: { representedClaimantDateOfBirth: representedClaimantDateOfBirthField },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    representedClaimantDateOfBirthField.values = [
      {
        label: (l: AnyRecord): string => l.dateFormat.day,
        name: 'day',
        classes: 'govuk-input--width-2',
        attributes: { maxLength: 2 },
      },
      {
        label: (l: AnyRecord): string => l.dateFormat.month,
        name: 'month',
        classes: 'govuk-input--width-2',
        attributes: { maxLength: 2 },
      },
      {
        label: (l: AnyRecord): string => l.dateFormat.year,
        name: 'year',
        classes: 'govuk-input--width-4',
        attributes: { maxLength: 4 },
      },
    ];
    this.formContent.fields = { representedClaimantDateOfBirth: representedClaimantDateOfBirthField };
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTED_CLAIMANT_DATE_OF_BIRTH,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTED_CLAIMANT_DATE_OF_BIRTH, {
      ...content,
    });
  };
}
