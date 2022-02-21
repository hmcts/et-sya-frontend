import { isFieldFilledIn } from '../../../main/components/form/validator';
import LipOrRepController from '../../../main/controllers/litigation_in_person_or_representative/lipOrRepController';
import { YesOrNo } from '../../../main/definitions/case';
import { LegacyUrls } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Litigation in Person or Representative Controller', () => {
  const t = {
    representingMyself: {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      representingMyself: {
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

  it("should render the 'representing myself (LiP) or using a representative choice' page", () => {
    const controller = new LipOrRepController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('lip-or-representative', expect.anything());
  });

  it("should render the Single or Multiple claims page when 'representing myself' is selected", () => {
    const body = { representingMyself: YesOrNo.YES };
    const controller = new LipOrRepController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/single-or-multiple-claim');
  });

  it("should render the legacy ET1 service when the 'making a claim for someone else' option is selected", () => {
    const body = { representingMyself: YesOrNo.NO };
    const controller = new LipOrRepController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(LegacyUrls.ET1);
  });

  it('should render same page if errors are present when nothing is selected', () => {
    const errors = [{ propertyName: 'representingMyself', errorType: 'required' }];
    const body = { representingMyself: '' };
    const controller = new LipOrRepController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
