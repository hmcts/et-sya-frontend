import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentativeCommsPrefController from '../../../../main/controllers/non-hmcts/RepresentativeCommsPrefController';
import { CaseTypeId } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { FormFields, FormOptions, Label } from '../../../../main/definitions/form';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('RepresentativeCommsPrefController', () => {
  const t = {
    'representative-comms-preference': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the update-preference page for England/Wales', () => {
      const controller = new RepresentativeCommsPrefController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { caseTypeId: CaseTypeId.ENGLAND_WALES } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.UPDATE_PREFERENCE, expect.anything());
    });

    it('should render the update-preference page for Scotland', () => {
      const controller = new RepresentativeCommsPrefController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { caseTypeId: CaseTypeId.SCOTLAND } });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.UPDATE_PREFERENCE, expect.anything());
    });

    it('should use England/Wales form content (with language/hearing fields) for England/Wales case', () => {
      const controller = new RepresentativeCommsPrefController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { caseTypeId: CaseTypeId.ENGLAND_WALES } });

      controller.get(request, response);

      const formContent = controller.getFormContent(CaseTypeId.ENGLAND_WALES);
      expect(formContent.fields).toHaveProperty('claimantContactPreference');
      expect(formContent.fields).toHaveProperty('claimantContactLanguagePreference');
      expect(formContent.fields).toHaveProperty('claimantHearingLanguagePreference');
    });

    it('should use Scotland form content (no language/hearing fields) for Scotland case', () => {
      const controller = new RepresentativeCommsPrefController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { caseTypeId: CaseTypeId.SCOTLAND } });

      controller.get(request, response);

      const formContent = controller.getFormContent(CaseTypeId.SCOTLAND);
      expect(formContent.fields).toHaveProperty('claimantContactPreference');
      expect(formContent.fields).not.toHaveProperty('claimantContactLanguagePreference');
      expect(formContent.fields).not.toHaveProperty('claimantHearingLanguagePreference');
    });
  });

  describe('post()', () => {
    it('should redirect to VIDEO_HEARINGS on valid England/Wales submission', async () => {
      const body = { claimantContactPreference: 'Email' };
      const controller = new RepresentativeCommsPrefController();
      const req = mockRequestEmpty({ body, userCase: { caseTypeId: CaseTypeId.ENGLAND_WALES } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.VIDEO_HEARINGS);
    });

    it('should redirect to VIDEO_HEARINGS on valid Scotland submission', async () => {
      const body = { claimantContactPreference: 'Post' };
      const controller = new RepresentativeCommsPrefController();
      const req = mockRequestEmpty({ body, userCase: { caseTypeId: CaseTypeId.SCOTLAND } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.VIDEO_HEARINGS);
    });

    it('should save claimantContactPreference to userCase on post', async () => {
      const body = { claimantContactPreference: 'Email' };
      const controller = new RepresentativeCommsPrefController();
      const req = mockRequestEmpty({ body, userCase: { caseTypeId: CaseTypeId.ENGLAND_WALES } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.claimantContactPreference).toEqual('Email');
    });
  });

  describe('getFormContent()', () => {
    it('should return England/Wales form content for ENGLAND_WALES caseTypeId', () => {
      const controller = new RepresentativeCommsPrefController();
      const content = controller.getFormContent(CaseTypeId.ENGLAND_WALES);
      expect(content.fields).toHaveProperty('claimantContactLanguagePreference');
      expect(content.fields).toHaveProperty('claimantHearingLanguagePreference');
    });

    it('should return Scotland form content for SCOTLAND caseTypeId', () => {
      const controller = new RepresentativeCommsPrefController();
      const content = controller.getFormContent(CaseTypeId.SCOTLAND);
      expect(content.fields).not.toHaveProperty('claimantContactLanguagePreference');
    });

    it('should invoke Scotland field label and value lambdas', () => {
      const controller = new RepresentativeCommsPrefController();
      const content = controller.getFormContent(CaseTypeId.SCOTLAND);
      const fields = content.fields as FormFields;
      const field = fields['claimantContactPreference'] as FormOptions;
      const l: AnyRecord = { label: 'Contact Preference', email: 'Email', post: 'Post' };
      const callLabel = (lbl: Label): string => (typeof lbl === 'function' ? lbl(l) : lbl);
      expect(callLabel(field.label)).toEqual('Contact Preference');
      expect(callLabel(field.values[0].label)).toEqual('Email');
      expect(callLabel(field.values[1].label)).toEqual('Post');
    });

    it('should invoke England/Wales additional field label and hint lambdas', () => {
      const controller = new RepresentativeCommsPrefController();
      const content = controller.getFormContent(CaseTypeId.ENGLAND_WALES);
      const fields = content.fields as FormFields;
      type RadioField = { label?: Label; hint?: Label; values: { label: Label }[] };
      const langField = fields['claimantContactLanguagePreference'] as unknown as RadioField;
      const hearingField = fields['claimantHearingLanguagePreference'] as unknown as RadioField;
      const l: AnyRecord = {
        languageLabel: 'Language',
        languageHint: 'Choose',
        hearingLabel: 'Hearing',
        welsh: 'Welsh',
        english: 'English',
      };
      const callLabel = (lbl: Label): string => (typeof lbl === 'function' ? lbl(l) : lbl);
      expect(callLabel(langField.label)).toEqual('Language');
      expect(callLabel(langField.hint)).toEqual('Choose');
      expect(callLabel(langField.values[0].label)).toEqual('Welsh');
      expect(callLabel(langField.values[1].label)).toEqual('English');
      expect(callLabel(hearingField.label)).toEqual('Hearing');
      expect(callLabel(hearingField.values[0].label)).toEqual('Welsh');
      expect(callLabel(hearingField.values[1].label)).toEqual('English');
    });
  });

  describe('getForm()', () => {
    it('should return a Form instance for England/Wales', () => {
      const controller = new RepresentativeCommsPrefController();
      const form = controller.getForm(CaseTypeId.ENGLAND_WALES);
      expect(form).toBeDefined();
      expect(form.getFormFields()).toHaveProperty('claimantContactPreference');
    });

    it('should return a Form instance for Scotland', () => {
      const controller = new RepresentativeCommsPrefController();
      const form = controller.getForm(CaseTypeId.SCOTLAND);
      expect(form).toBeDefined();
      expect(form.getFormFields()).not.toHaveProperty('claimantContactLanguagePreference');
    });
  });
});
