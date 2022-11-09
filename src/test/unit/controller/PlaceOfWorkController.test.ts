import PlaceOfWorkController from '../../../main/controllers/PlaceOfWorkController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

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

  it('should redirect back to self if there are errors', async () => {
    const errors = [{ propertyName: 'workAddress1', errorType: 'required' }];
    const body = {
      workAddress1: '',
      workAddress2: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to Acas number page if no errors', async () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress2: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
    expect(req.session.errors).toHaveLength(0);
  });
  it('should redirect to your claim has been saved page when save as draft selected and nothing is entered', async () => {
    const body = { saveForLater: true };
    const controller = new PlaceOfWorkController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should add place of work to the session userCase', async () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress2: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.workAddress1).toStrictEqual('31 The Street');
    expect(req.session.userCase.workAddress2).toStrictEqual('');
    expect(req.session.userCase.workAddressTown).toStrictEqual('Exeter');
    expect(req.session.userCase.workAddressCountry).toStrictEqual('United Kingdom');
    expect(req.session.userCase.workAddressPostcode).toStrictEqual('EX7 8KK');
  });
});
