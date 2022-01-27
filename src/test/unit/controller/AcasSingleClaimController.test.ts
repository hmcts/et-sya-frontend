import AcasSingleClaimController from '../../../main/controllers/acas_single_claim/AcasSingleClaimController';
import sinon from 'sinon';
import { AppRequest } from '../../../main/definitions/appRequest';
import { FormContent } from '../../../main/definitions/form';
import { YesOrNo } from 'definitions/case';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Acas single claim Controller', () => {
  const t = {
    'acas-single-claim': {},
    common: {},
  };

  const mockFormContent = {
    fields: {
      isAcasSingle: {
        type: 'radios',
        id: 'radio1',
        name: YesOrNo.YES,
        validator: (value: any) => isFieldFilledIn(value),
      },
    },
  } as unknown as FormContent;

  it('should render the Acas Single Claim controller page', () => {
    const acasSingleClaimController = new AcasSingleClaimController(
      mockFormContent,
    );

    const response = mockResponse();
    const userCase = { isAcasSingle: YesOrNo.YES };
    const request = <AppRequest>mockRequest({ t, userCase });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('acas-single-claim');

    acasSingleClaimController.get(request, response);
    responseMock.verify();
  });

  describe('post()', () => {
    it('should redirect back to Acas Single Claim page when errors are present', () => {
      const errors = [{ propertyName: 'isAcasSingle', errorType: 'required' }];
      const body = { 'isAcasSingle': '' };

      const controller = new AcasSingleClaimController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData for Acas Single', () => {
      const body = { 'isAcasSingle': YesOrNo.YES };

      const controller = new AcasSingleClaimController(mockFormContent);

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith('/');
      expect(req.session.userCase).toStrictEqual({
        isAcasSingle: YesOrNo.YES,
      });
    });
  });
});
