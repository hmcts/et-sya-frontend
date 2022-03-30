import PlaceOfWorkController from '../../../main/controllers/PlaceOfWorkController';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Place Of Work Controller Tests', () => {
  const t = {
    'place-of-work': {},
    'enter-address': {},
    common: {},
  };

  it('should render place of work page', () => {
    const controller = new PlaceOfWorkController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('place-of-work', expect.anything());
  });

  it('stillWorking should be false when the user has previously selected no longer working', () => {
    const body = {};
    const userCase = {
      isStillWorking: StillWorking.NO_LONGER_WORKING,
    };

    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'place-of-work',
      expect.objectContaining({
        stillWorking: false,
      })
    );
  });

  it('stillWorking should be true when the user has previously selected that they are were still working', () => {
    const body = {};
    const userCase = {
      isStillWorking: StillWorking.WORKING,
    };

    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'place-of-work',
      expect.objectContaining({
        stillWorking: true,
      })
    );
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'workAddress1', errorType: 'required' }];
    const body = {
      workAddress1: '',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCounty: '',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home if no errors', () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCounty: '',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.HOME);
    expect(req.session.errors).toEqual([]);
  });
});
