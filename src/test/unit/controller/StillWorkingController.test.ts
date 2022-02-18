import { isFieldFilledIn } from '../../../main/components/form/validator';
import StillWorkingController from '../../../main/controllers/still_working/StillWorkingController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Are you still working controller', () => {
  const t = {
    isStillWorking: {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      isStillWorking: {
        type: 'radios',
        values: [
          {
            value: 'WORKING',
          },
          {
            value: 'NOTICE',
          },
          {
            value: 'NOT WORKING',
          },
        ],
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
    },
    submit: {
      text: 'continue',
    },
  } as unknown as FormContent;

  it('should render are you still working page', () => {
    const controller = new StillWorkingController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('still-working', expect.anything());
  });

  it('should render the employment details(WORKING) page', () => {
    const body = { isStillWorking: 'WORKING' };
    const controller = new StillWorkingController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    //TODO update with appropriate URL
    expect(res.redirect).toBeCalledWith('/');
  });

  it('should render the employment details(NOTICE) page', () => {
    const body = { isStillWorking: 'NOTICE' };
    const controller = new StillWorkingController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    //TODO update with appropriate URL
    expect(res.redirect).toBeCalledWith('/');
  });
  it('should render the employment details(NO LONGER WORKING) page', () => {
    const body = { isStillWorking: 'NO LONGER WORKING' };
    const controller = new StillWorkingController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    //TODO update with appropriate URL
    expect(res.redirect).toBeCalledWith('/');
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'isStillWorking', errorType: 'required' }];
    const body = { isStillWorking: '' };
    const controller = new StillWorkingController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
