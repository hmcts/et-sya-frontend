import TellUsWhatYouWantController from '../../../main/controllers/TellUsWhatYouWantController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Tell Us What You Want Controller', () => {
  const t = {
    'tell-us-what-you-want': {},
    common: {},
  };

  beforeAll(() => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  });

  it('should render the tell us what you want page', () => {
    const controller = new TellUsWhatYouWantController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TELL_US_WHAT_YOU_WANT, expect.anything());
  });

  describe('Correct validation', () => {
    it('should not require input (all fields are optional)', async () => {
      const req = mockRequest({ body: {} });
      await new TellUsWhatYouWantController().post(req, mockResponse());

      expect(req.session.errors).toHaveLength(0);
    });

    it('should assign userCase from the page form data', async () => {
      const req = mockRequest({
        body: {
          tellUsWhatYouWant: ['compensationOnly'],
        },
      });
      await new TellUsWhatYouWantController().post(req, mockResponse());

      expect(req.session.userCase).toMatchObject({ tellUsWhatYouWant: ['compensationOnly'] });
    });
  });
});
