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
});
