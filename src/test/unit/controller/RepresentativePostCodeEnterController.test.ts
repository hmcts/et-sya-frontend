import RepresentativePostCodeEnterController from '../../../main/controllers/RepresentativePostCodeEnterController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Representative PostCode Enter Controller', () => {
  const t = {
    common: {},
  };

  it('should render the Representative Postcode Enter page', () => {
    const controller = new RepresentativePostCodeEnterController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('representative-postcode-enter', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the postcode field is empty", async () => {
      const body = { representativeEnterPostcode: '' };
      const errors = [{ propertyName: 'representativeEnterPostcode', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentativePostCodeEnterController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it("should return an 'invalid' error when an invalid postcode is entered", async () => {
      const body = { representativeEnterPostcode: 'NOTAPOSTCODE' };
      const errors = [{ propertyName: 'representativeEnterPostcode', errorType: 'invalid' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentativePostCodeEnterController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to the postcode select page on a valid postcode', async () => {
      const body = { representativeEnterPostcode: 'SW1A 1AA' };

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentativePostCodeEnterController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTATIVE_POSTCODE_SELECT);
      expect(req.session.errors).toHaveLength(0);
    });

    it('should save the postcode to userCase on a valid postcode', async () => {
      const body = { representativeEnterPostcode: 'EC1A 1BB' };

      const req = mockRequest({ body });
      const res = mockResponse();
      await new RepresentativePostCodeEnterController().post(req, res);

      expect(req.session.userCase.representativeEnterPostcode).toEqual('EC1A 1BB');
    });
  });
});
