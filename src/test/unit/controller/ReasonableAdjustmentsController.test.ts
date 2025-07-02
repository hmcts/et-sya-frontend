import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Reasonable Adjustments Controller', () => {
  const t = {
    'reasonable-adjustments': {},
    common: {},
  };
  it('should render the Reasonable Adjustments page', () => {
    const controller = new ReasonableAdjustmentsController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('reasonable-adjustments', expect.anything());
  });

  describe('post() reasonable adjustments', () => {
    it('should redirect to the next page when nothing is selected as the form is optional', async () => {
      const body = {};

      const controller = new ReasonableAdjustmentsController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
    });
  });

  it('should add the reasonable adjustments form value to the userCase', async () => {
    const body = {
      reasonableAdjustments: 'Yes',
      reasonableAdjustmentsDetail: 'Reasonable adjustments detail test text',
    };

    const controller = new ReasonableAdjustmentsController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      reasonableAdjustments: 'Yes',
      reasonableAdjustmentsDetail: 'Reasonable adjustments detail test text',
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
    });
  });
});
