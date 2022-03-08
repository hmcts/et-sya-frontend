import EmploymentDetailsPensionController from '../../../main/controllers/employment_details_pension/EmploymentDetailsPensionController';
import { YesOrNo } from '../../../main/definitions/case';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Employment details pension controller', () => {
  const t = {
    'employment-details-pension': {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      employmentDetailsPension: {
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

  it('should render the employment details notice pension page', () => {
    const controller = new EmploymentDetailsPensionController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('employment-details-pension', expect.anything());
  });

  it('should add the employment details pension form value to the userCase', () => {
    const body = { employmentDetailsPension: YesOrNo.NO };

    const controller = new EmploymentDetailsPensionController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/');
    expect(req.session.userCase).toStrictEqual({ employmentDetailsPension: YesOrNo.NO });
  });
});
