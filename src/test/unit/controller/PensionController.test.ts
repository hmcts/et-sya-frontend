import PensionController from '../../../main/controllers/pension/PensionController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { FormContent, FormError } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Pension controller', () => {
  const t = {
    pension: {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      pension: {
        type: 'radios',
        values: [
          {
            value: YesOrNo.YES,
          },
          {
            value: YesOrNo.NO,
          },
        ],
      },
    },
  } as unknown as FormContent;

  it('should render the pension page', () => {
    const controller = new PensionController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('pension', expect.anything());
  });

  it('should not return an error when no radio buttons are selected', () => {
    const body = {
      pension: '',
    };
    const errors: FormError[] = [];
    const controller = new PensionController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the pension form value to the userCase', () => {
    const body = { pension: YesOrNo.NO };

    const controller = new PensionController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.BENEFITS);
    expect(req.session.userCase).toStrictEqual({ pension: YesOrNo.NO });
  });
});
