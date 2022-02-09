import { isFieldFilledIn } from '../../../main/components/form/validator';
import SingleOrMultipleController from '../../../main/controllers/single_or_multiple_claim/singleOrMultipleController';
import { YesOrNo } from '../../../main/definitions/case';
import { LEGACY_URLS } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Single or Multiple Claim Controller', () => {
  const t = {
    isASingleClaim: {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      isASingleClaim: {
        type: 'radios',
        values: [
          {
            value: YesOrNo.YES,
          },
          {
            value: YesOrNo.NO,
          },
        ],
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
    },
    submit: {
      text: 'continue',
    },
  } as unknown as FormContent;

  it('should render single or multiple claim page', () => {
    const controller = new SingleOrMultipleController(mockFormContent);

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('single-or-multiple-claim', expect.anything());
  });

  it("should render the next page when 'single' is selected", () => {
    const body = { isASingleClaim: YesOrNo.YES };
    const controller = new SingleOrMultipleController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/');
  });

  it("should render the legacy ET1 service when the 'multiple' claim option is selected", () => {
    const body = { isASingleClaim: YesOrNo.NO };
    const controller = new SingleOrMultipleController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(LEGACY_URLS.ET1);
  });

  it('should render same page if nothing selected', () => {
    const errors = [{ propertyName: 'isASingleClaim', errorType: 'required' }];
    const body = { isASingleClaim: '' };
    const controller = new SingleOrMultipleController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
