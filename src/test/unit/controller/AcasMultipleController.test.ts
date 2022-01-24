import sinon from 'sinon';
import { acasMultipleMockRequest } from '../mocks/mockRequest';
import AcasMultipleController from '../../../main/controllers/acas_multiple/AcasMultipleController';
import { FormContent } from '../../../main/definitions/form';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { AnyRecord } from '../../../main/definitions/util-types';
import { isFieldFilledIn } from '../../../main/components/form/validator';

describe('Acas Multiple Controller', () => {
  const t = {
    'acas-multiple': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      acasButtons: {
        classes: 'govuk-radios--inline',
        id: 'acas-multiple',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.radio1,
            name: 'radio1',
            value: 'Yes',
            attributes: { maxLength: 2 },
          },
          {
            label: (l: AnyRecord): string => l.radio2,
            value:'No',
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
    const request = <AppRequest>acasMultipleMockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('acas-multiple');

    acasMultipleController.get(request, response);
    responseMock.verify();
    expect(request.session.userCase).toEqual({
      acasButtons: {
        radio1: '',
        radio2: '',
      },
      id: '1234',
    });
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'acasButtons', errorType: 'required' }];
    const body = { 'acas-multiple': '' };

    const controller = new AcasMultipleController(mockFormContent);

    const req = acasMultipleMockRequest( { body } );
    const res = mockResponse();
    controller.post(req, res);

    expect(req.session.userCase).toEqual({
      acasButtons: {
        radio1: '',
        radio2: '',
      },
      id: '1234',
    });

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
