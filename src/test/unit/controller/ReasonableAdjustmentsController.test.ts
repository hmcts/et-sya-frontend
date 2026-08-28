import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseTypeId } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
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

  it('should redirect to your support when CUI your support is enabled for the case type', () => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    try {
      const controller = new ReasonableAdjustmentsController();

      const response = mockResponse();
      const request = mockRequest({ userCase: { caseTypeId: CaseTypeId.SCOTLAND }, t });

      controller.get(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
    } finally {
      featureMock.mockRestore();
    }
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
    });
  });
});
