import ClaimantTellUsWhatYouWantController from '../../../main/controllers/ClaimantTellUsWhatYouWantController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TellUsWhatYouWant } from '../../../main/definitions/definition';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantTellUsWhatYouWantController', () => {
  const t = {
    'claimant-tell-us-what-you-want': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant tell us what you want page', () => {
      const controller = new ClaimantTellUsWhatYouWantController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_TELL_US_WHAT_YOU_WANT, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_COMPENSATION when compensation only is selected (AC1)', async () => {
      const body = { tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY] };
      const controller = new ClaimantTellUsWhatYouWantController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_COMPENSATION);
    });

    it('should redirect to CLAIMANT_TRIBUNAL_RECOMMENDATION when tribunal recommendation is selected (AC1)', async () => {
      const body = { tellUsWhatYouWant: [TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION] };
      const controller = new ClaimantTellUsWhatYouWantController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_TRIBUNAL_RECOMMENDATION);
    });

    it('should redirect to CLAIMANT_LINKED_CASES when no option is selected', async () => {
      const body = {};
      const controller = new ClaimantTellUsWhatYouWantController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_LINKED_CASES);
    });

    it('should redirect to CLAIMANT_COMPENSATION when compensation is among multiple selections', async () => {
      const body = {
        tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
      };
      const controller = new ClaimantTellUsWhatYouWantController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_COMPENSATION);
    });
  });
});
