import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantRespondentAddressDetailsController from '../../../../main/controllers/non-hmcts/ClaimantRespondentAddressDetailsController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantRespondentAddressDetailsController', () => {
  const t = {
    'non-hmcts/claimant-respondent-address-details': {},
    'respondent-address': {},
    'enter-address': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant respondent address details page', () => {
      const controller = new ClaimantRespondentAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_RESPONDENT_ADDRESS_DETAILS,
        expect.anything()
      );
    });

    it('should pass respondentName from first respondent to render context', () => {
      const controller = new ClaimantRespondentAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { respondents: [{ respondentName: 'Acme Corp' }] as any },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toBe('Acme Corp');
    });

    it('should pass empty string when no respondents', () => {
      const controller = new ClaimantRespondentAddressDetailsController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { respondents: [] as any } });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toBe('');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_DID_WORK_AT on valid address submission', async () => {
      const body = {
        respondentAddress1: '56 High Street',
        respondentAddressTown: 'London',
        respondentAddressCountry: 'England',
        respondentAddressPostcode: 'SW17 0RN',
      };
      const controller = new ClaimantRespondentAddressDetailsController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_DID_WORK_AT);
    });
  });
});
