import ValidNoAcasReasonController from '../../../main/controllers/ValidNoAcasReasonController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Valid no acas reason Controller', () => {
  const t = {
    'valid-no-acas-reason': {},
    common: {},
  };

  it('should render the Valid No Acas Reason controller page', () => {
    const controller = new ValidNoAcasReasonController();
    const response = mockResponse();
    const userCase = { validNoAcasReason: YesOrNo.YES };
    const request = mockRequest({ t, userCase });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('valid-no-acas-reason', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to Valid No Acas Reason page when errors are present', () => {
      const errors = [{ propertyName: 'validNoAcasReason', errorType: 'required' }];
      const body = { validNoAcasReason: '' };

      const controller = new ValidNoAcasReasonController();

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData for Valid No Acas Reason', () => {
      const body = { validNoAcasReason: YesOrNo.YES };

      jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

      const controller = new ValidNoAcasReasonController();

      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
      expect(req.session.userCase).toStrictEqual({
        validNoAcasReason: YesOrNo.YES,
      });
    });
  });
});
