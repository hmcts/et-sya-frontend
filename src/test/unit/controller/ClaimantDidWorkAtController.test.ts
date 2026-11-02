import ClaimantDidWorkAtController from '../../../main/controllers/ClaimantDidWorkAtController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantDidWorkAtController', () => {
  const t = {
    'claimant-did-work-at': {},
    common: {},
  };

  const respondent = {
    respondentNumber: 1,
    respondentName: 'Acme Ltd',
    respondentAddress1: '1 Main Street',
    respondentAddress2: 'Floor 2',
    respondentAddressTown: 'London',
    respondentAddressCountry: 'England',
    respondentAddressPostcode: 'SW1A 1AA',
  };

  const secondRespondent = {
    respondentNumber: 2,
    respondentName: 'Beta Corp',
    respondentAddress1: '99 Side Road',
    respondentAddress2: 'Unit 5',
    respondentAddressTown: 'Cardiff',
    respondentAddressCountry: 'Wales',
    respondentAddressPostcode: 'CF10 1AA',
  };

  describe('get()', () => {
    it('should render the claimant did work at page', () => {
      const controller = new ClaimantDidWorkAtController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_DID_WORK_AT, expect.anything());
    });

    it('should pre-fill respondent name and address from session (AC1)', () => {
      const controller = new ClaimantDidWorkAtController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { respondents: [respondent] } });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toEqual('Acme Ltd');
      expect(renderArgs.addressLine1).toEqual('1 Main Street');
      expect(renderArgs.addressLine2).toEqual('Floor 2');
      expect(renderArgs.addressTown).toEqual('London');
      expect(renderArgs.addressCountry).toEqual('England');
      expect(renderArgs.addressPostcode).toEqual('SW1A 1AA');
    });

    it('should show the newly added respondent, not the first, when adding another respondent', () => {
      const controller = new ClaimantDidWorkAtController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { respondents: [respondent, secondRespondent] },
        session: { claimantRespondentNumber: '2' },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toEqual('Beta Corp');
      expect(renderArgs.addressLine1).toEqual('99 Side Road');
      expect(renderArgs.addressTown).toEqual('Cardiff');
      expect(renderArgs.addressPostcode).toEqual('CF10 1AA');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_ACAS_CERT_NUM when Yes is selected (AC2)', async () => {
      const body = { claimantWorkAddressQuestion: YesOrNo.YES };
      const controller = new ClaimantDidWorkAtController();
      const req = mockRequest({ body, userCase: { respondents: [respondent] } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_ACAS_CERT_NUM);
    });

    it('should copy respondent address to work address when Yes is selected (AC2)', async () => {
      const body = { claimantWorkAddressQuestion: YesOrNo.YES };
      const controller = new ClaimantDidWorkAtController();
      const req = mockRequestEmpty({ body, userCase: { respondents: [respondent] } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.workAddress1).toEqual('1 Main Street');
      expect(req.session.userCase.workAddressTown).toEqual('London');
      expect(req.session.userCase.workAddressPostcode).toEqual('SW1A 1AA');
    });

    it('should copy the newly added respondent address, not the first, when adding another respondent', async () => {
      const body = { claimantWorkAddressQuestion: YesOrNo.YES };
      const controller = new ClaimantDidWorkAtController();
      const req = mockRequestEmpty({
        body,
        userCase: { respondents: [respondent, secondRespondent] },
        session: { claimantRespondentNumber: '2' },
      });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.workAddress1).toEqual('99 Side Road');
      expect(req.session.userCase.workAddressTown).toEqual('Cardiff');
      expect(req.session.userCase.workAddressPostcode).toEqual('CF10 1AA');
    });

    it('should redirect to CLAIMANT_WORK_POSTCODE_ENTER when No is selected (AC3)', async () => {
      const body = { claimantWorkAddressQuestion: YesOrNo.NO };
      const controller = new ClaimantDidWorkAtController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_WORK_POSTCODE_ENTER);
    });

    it('should stay on page and error when no answer given', async () => {
      const body = { claimantWorkAddressQuestion: '' };
      const controller = new ClaimantDidWorkAtController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors.some((e: any) => e.propertyName === 'claimantWorkAddressQuestion')).toBe(true);
    });
  });
});
