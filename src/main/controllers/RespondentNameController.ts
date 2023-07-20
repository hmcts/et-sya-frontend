import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, RespondentType, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getRespondentIndex, getRespondentRedirectUrl } from './helpers/RespondentHelpers';

const logger = getLogger('RespondentNameController');

export default class RespondentNameController {
  private readonly form: Form;
  private readonly respondentNameContent: FormContent = {
    fields: {
      respondentName: {
        id: 'respondentName',
        name: 'respondentName',
        type: 'text',
        hidden: true,
      },
      respondentType: {
        classes: 'govuk-radios',
        id: 'respondentType',
        type: 'radios',
        hint: l => l.hint,
        values: [
          {
            name: 'respondentType',
            label: (l: AnyRecord): string => l.individualLabel,
            value: RespondentType.INDIVIDUAL,
            subFields: {
              respondentFirstName: {
                id: 'respondentFirstName',
                name: 'respondentFirstName',
                type: 'text',
                classes: 'govuk-text',
                attributes: { maxLength: 2500 },
                label: (l: AnyRecord): string => l.firstNameLabel,
                labelAsHint: true,
                validator: isFieldFilledIn,
              },
              respondentLastName: {
                id: 'respondentLastName',
                name: 'respondentLastName',
                type: 'text',
                classes: 'govuk-text',
                attributes: { maxLength: 2500 },
                label: (l: AnyRecord): string => l.lastNameLabel,
                labelAsHint: true,
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'respondentType',
            label: (l: AnyRecord): string => l.companyLabel,
            value: RespondentType.ORGANISATION,
            subFields: {
              respondentOrganisation: {
                id: 'respondentOrganisation',
                name: 'respondentOrganisation',
                type: 'text',
                classes: 'govuk-text',
                attributes: { maxLength: 2500 },
                label: (l: AnyRecord): string => l.orgLabel,
                labelAsHint: true,
                validator: isFieldFilledIn,
              },
            },
          },
        ],
        validator: isFieldFilledIn,
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
    this.form = new Form(<FormFields>this.respondentNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedRadio = req.body.respondentType;
    userCase.respondentType = selectedRadio;

    switch (selectedRadio) {
      case RespondentType.INDIVIDUAL:
        req.body.respondentName = req.body.respondentFirstName + ' ' + req.body.respondentLastName;
        req.body.respondentOrganisation = undefined;
        break;
      case RespondentType.ORGANISATION:
        req.body.respondentName = req.body.respondentOrganisation;
        req.body.respondentFirstName = undefined;
        req.body.respondentLastName = undefined;
        break;
      default:
        req.session.errors = [];
        req.session.errors.push({ propertyName: 'respondentType', errorType: 'required' });
        return res.redirect(getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_NAME));
    }

    const redirectUrl = getRespondentRedirectUrl(req.params.respondentNumber, PageUrls.RESPONDENT_POSTCODE_ENTER);
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    let respondentIndex: number;
    if (req.session.userCase?.respondents) {
      respondentIndex = getRespondentIndex(req);
    }

    const content = getPageContent(
      req,
      this.respondentNameContent,
      [TranslationKeys.COMMON, TranslationKeys.RESPONDENT_NAME],
      respondentIndex
    );
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...content,
    });
  };
}
