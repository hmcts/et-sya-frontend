import { isFieldFilledIn, isInvalidPostcode } from '../../../main/components/form/validator';
import PlaceOfWorkController from '../../../main/controllers/place_of_work/PlaceOfWorkController';
import { PageUrls } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { AnyRecord } from '../../../main/definitions/util-types';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Place Of Work Controller Tests', () => {
  const t = {
    'place-of-work': {},
    'enter-address': {},
    common: {},
  };

  const mockedFormContent = {
    fields: {
      workAddress1: {
        id: 'address1',
        type: 'text',
        validator: isFieldFilledIn,
      },
      workAddress2: {
        id: 'address2',
        type: 'text',
      },
      workAddressTown: {
        id: 'addressTown',
        type: 'text',
        validator: isFieldFilledIn,
      },
      workAddressCounty: {
        id: 'addressCounty',
        type: 'text',
      },
      workAddressPostcode: {
        id: 'addressPostcode',
        type: 'text',
        validator: isInvalidPostcode,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
    },
  } as unknown as FormContent;

  it('should render place of work page', () => {
    const controller = new PlaceOfWorkController(mockedFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('place-of-work', expect.anything());
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
    const controller = new PlaceOfWorkController(mockedFormContent);

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
    const controller = new PlaceOfWorkController(mockedFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.HOME);
    expect(req.session.errors).toEqual([]);
  });
});
