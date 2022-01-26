import sinon from 'sinon';
import SingleOrMultipleController from '../../../main/controllers/single_or_multiple_claim/singleOrMultipleController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { URLS } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { YesOrNo } from '../../../main/definitions/case';

describe('Single or Multiple Claim Controller', () => {
  const t = {
    'isASingleClaim': {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      'isASingleClaim': {
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
    const controller = new SingleOrMultipleController(
      mockFormContent,
    );

    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('single-or-multiple-claim');

    controller.get(request, response);
    responseMock.verify();
  });

  it('should render the next page when \'single\' is selected', () => {
    const body = { isASingleClaim: YesOrNo.YES };
    const controller = new SingleOrMultipleController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/');
  });

  it('should render the legacy ET1 service when the \'multiple\' claim option is selected', () => {
    const body = { isASingleClaim: YesOrNo.NO };
    const controller = new SingleOrMultipleController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(URLS.LEGACY_ET1);

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
