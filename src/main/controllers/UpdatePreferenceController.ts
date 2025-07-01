import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseTypeId, EmailOrPost, EnglishOrWelsh } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('UpdatePreferenceController');

export default class UpdatePreferenceController {
  private readonly scotlandFormContent: FormContent = {
    fields: {
      claimantContactPreference: {
        classes: 'govuk-radios--inline',
        id: 'update-preference',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.email,
            name: 'email',
            value: EmailOrPost.EMAIL,
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.post,
            name: 'post',
            value: EmailOrPost.POST,
            attributes: { maxLength: 2 },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  private readonly englandWalesFormContent: FormContent = {
    ...this.scotlandFormContent,
    fields: {
      ...this.scotlandFormContent.fields,
      claimantContactLanguagePreference: {
        classes: 'govuk-radios--inline',
        id: 'update-preference-language',
        type: 'radios',
        label: (l: AnyRecord): string => l.languageLabel,
        hint: (l: AnyRecord): string => l.languageHint,
        values: [
          {
            label: (l: AnyRecord): string => l.welsh,
            name: 'welsh',
            value: EnglishOrWelsh.WELSH,
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.english,
            name: 'english',
            value: EnglishOrWelsh.ENGLISH,
            attributes: { maxLength: 2 },
          },
        ],
      },
      claimantHearingLanguagePreference: {
        classes: 'govuk-radios--inline',
        id: 'update-hearing-language',
        type: 'radios',
        label: (l: AnyRecord): string => l.hearingLabel,
        values: [
          {
            label: (l: AnyRecord): string => l.welsh,
            name: 'welsh',
            value: EnglishOrWelsh.WELSH,
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.english,
            name: 'english',
            value: EnglishOrWelsh.ENGLISH,
            attributes: { maxLength: 2 },
          },
        ],
      },
    },
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.getForm(req.session.userCase.caseTypeId), logger, PageUrls.VIDEO_HEARINGS);
  };

  public get = (req: AppRequest, res: Response): void => {
    checkCaseStateAndRedirect(req, res);
    const content = getPageContent(req, this.getFormContent(req.session.userCase.caseTypeId), [
      TranslationKeys.COMMON,
      TranslationKeys.UPDATE_PREFERENCE,
    ]);
    assignFormData(req.session.userCase, this.getForm(req.session.userCase.caseTypeId).getFormFields());
    res.render(TranslationKeys.UPDATE_PREFERENCE, {
      ...content,
    });
  };

  getForm = (caseTypeId: CaseTypeId): Form => {
    return new Form(<FormFields>this.getFormContent(caseTypeId).fields);
  };

  // Get form content according to the caseTypeId
  getFormContent = (caseTypeId: CaseTypeId): FormContent => {
    return caseTypeId === CaseTypeId.ENGLAND_WALES ? this.englandWalesFormContent : this.scotlandFormContent;
  };
}
