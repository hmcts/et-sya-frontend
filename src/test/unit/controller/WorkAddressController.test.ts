import { isWorkAddressLineOneValid } from '../../../main/components/form/validator';
import WorkAddressController from '../../../main/controllers/work_address/WorkAddressController';
import { PageUrls } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Work Address Controller', () => {
  const t = {
    'work-address': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      workAddress1: {
        type: 'text',
        id: 'address-line1',
        name: 'address-line1',
        validator: isWorkAddressLineOneValid,
      },
    },
  } as unknown as FormContent;

  it('should render the Work Address controller page', () => {
    const controller = new WorkAddressController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('work-address', expect.anything());
  });

  describe('post() work address', () => {
    it('should redirect to SELF when errors are present', () => {
      const errors = [{ propertyName: 'workAddress1', errorType: 'required' }];
      const body = {
        workAddress1: '',
      };
      const controller = new WorkAddressController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to home if no errors', () => {
      const body = {
        workAddress1: '31 The Street',
      };
      const controller = new WorkAddressController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.HOME);
      expect(req.session.errors).toEqual([]);
    });
  });
});
