import AcasCertNumController from '../../../main/controllers/AcasCertNumController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Acas Cert Num Controller', () => {
  const t = {
    acasCert: {},
    common: {},
  };

  it('should render the acas cert num controller page', () => {
    const controller = new AcasCertNumController();

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ACAS_CERT_NUM, expect.anything());
  });

  it('should redirect to respondent details check when yes is selected', () => {
    const body = { acasCert: YesOrNo.YES };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });

  it('should redirect to no acas number reason when no is selected', () => {
    const body = { acasCert: YesOrNo.NO };

    const controller = new AcasCertNumController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.NO_ACAS_NUMBER);
  });
});
