import sinon from 'sinon';
import AcasMultipleController from '../../../main/controllers/acas_multiple/AcasMultipleController';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { isFieldFilledIn } from '../../../main/components/form/validator';

describe('Acas Multiple Controller', () => {
  const t = {
    'acas-multiple': {},
    common: {},
  };
  const userCase = {
    acas_multiple:
    {
      radio1: '',
      radio2: '',
    },
  };

  const mockFormContent = {
    fields: {
      acasMultiple: {
        classes: 'govuk-radios--inline',
        id: 'acas-multiple',
        type: 'radios',
        values: [
          {
            name: 'radio1',
            label: 'radio1',
            value: '',
            attributes: { maxLength: 2 },
          },
          {
            name: 'radio1',
            label: 'radio2',
            value: '',
            attributes: { maxLength: 2 },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
  } as unknown as FormContent;

  it('should render the AcasMultipleController page', () => {
    const acasMultipleController = new AcasMultipleController(mockFormContent);

    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('acas-multiple');

    acasMultipleController.get(request, response);
    responseMock.verify();
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'acasMultiple', errorType: 'required' }];
    const body = { 'acas-multiple': '' };

    const controller = new AcasMultipleController(mockFormContent);

    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});