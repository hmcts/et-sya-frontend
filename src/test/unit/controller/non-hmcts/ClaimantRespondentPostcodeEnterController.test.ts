import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantRespondentPostcodeEnterController from '../../../../main/controllers/non-hmcts/ClaimantRespondentPostcodeEnterController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantRespondentPostcodeEnterController', () => {
  const t = {
    'non-hmcts/claimant-respondent-postcode-enter': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant respondent postcode enter page', () => {
      const controller = new ClaimantRespondentPostcodeEnterController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_RESPONDENT_POSTCODE_ENTER,
        expect.anything()
      );
    });

    it('should pass respondentName from first respondent to render context', () => {
      const controller = new ClaimantRespondentPostcodeEnterController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { respondents: [{ respondentName: 'Magic Roundabout' }] as any },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toBe('Magic Roundabout');
    });

    it('should pass empty string as respondentName when respondents list is empty', () => {
      const controller = new ClaimantRespondentPostcodeEnterController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { respondents: [] as any } });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.respondentName).toBe('');
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_RESPONDENT_POSTCODE_SELECT on valid postcode', async () => {
      const body = { respondentEnterPostcode: 'SW1A 1AA' };
      const controller = new ClaimantRespondentPostcodeEnterController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_POSTCODE_SELECT);
    });
  });
});
