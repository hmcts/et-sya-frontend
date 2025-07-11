import WorkPostCodeEnterController from '../../../main/controllers/WorkPostCodeEnterController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Work Postcode Enter Controller', () => {
  const t = {
    'work-postcode-enter': {},
    common: {},
  };

  it('should render the Work Enter Postcode page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new WorkPostCodeEnterController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('work-postcode-enter', expect.anything());
  });

  it('should render the Work Enter Postcode page when returnUrl is CHECK_ANSWERS', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.returnUrl = PageUrls.CHECK_ANSWERS;

    new WorkPostCodeEnterController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('work-postcode-enter', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the postcode field is empty", () => {
      const body = {
        workEnterPostcode: '',
      };
      const errors = [{ propertyName: 'workEnterPostcode', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      new WorkPostCodeEnterController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should set the workEnterPostCode value in userCase', () => {
      const postCode = 'G44 5TY';
      const body = { workEnterPostcode: postCode };

      const req = mockRequest({ body });
      const res = mockResponse();
      new WorkPostCodeEnterController().post(req, res);
      expect(req.session.userCase.workEnterPostcode).toEqual(postCode);
    });

    it('should redirect to the same screen when no postcode is entered', async () => {
      const errors = [{ propertyName: 'workEnterPostcode', errorType: 'required' }];
      const body = { workEnterPostcode: '' };

      const controller = new WorkPostCodeEnterController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to the same screen when wrong postcode is entered', async () => {
      const errors = [{ propertyName: 'workEnterPostcode', errorType: 'invalid' }];
      const body = { workEnterPostcode: 'G44 555' };

      const controller = new WorkPostCodeEnterController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should get the label', async () => {
      const errors = [{ propertyName: 'workEnterPostcode', errorType: 'required' }];
      const body = { workEnterPostcode: '' };

      const controller = new WorkPostCodeEnterController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
