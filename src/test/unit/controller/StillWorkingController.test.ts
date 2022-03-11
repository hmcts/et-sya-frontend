import { isFieldFilledIn } from '../../../main/components/form/validator';
import StillWorkingController from '../../../main/controllers/still_working/StillWorkingController';
import { StillWorking } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
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
            value: StillWorking.WORKING,
          },
          {
            value: StillWorking.NOTICE,
          },
          {
            value: StillWorking.NO_LONGER_WORKING,
          },
        ],
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
    },
  } as unknown as FormContent;

  it('should render are you still working page', () => {
    const controller = new StillWorkingController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STILL_WORKING, expect.anything());
  });

  it('should render the employment details page', () => {
    const body = { isStillWorking: StillWorking.WORKING };
    const controller = new StillWorkingController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(PageUrls.JOB_TITLE);
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
