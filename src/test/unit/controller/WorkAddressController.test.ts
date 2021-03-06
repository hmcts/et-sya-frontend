import WorkAddressController from '../../../main/controllers/WorkAddressController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('Update Work Address Controller', () => {
  const t = {
    claimantWorkAddressQuestion: {},
    common: {},
  };

  it('should render the Work Address page', () => {
    const controller = new WorkAddressController();
    const response = mockResponse();
    const req = <AppRequest>mockRequest({ t });

    req.session.userCase = userCaseWithRespondent;

    controller.get(req, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.WORK_ADDRESS, expect.anything());
  });

  it('should redirect to acas cert num page when yes is selected', () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.YES };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ACAS_CERT_NUM);
    // TODO Test respondent address is copied to work address
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual('Yes');
  });

  it('should redirect to place of work page when no is selected', () => {
    const body = { claimantWorkAddressQuestion: YesOrNo.NO };

    const controller = new WorkAddressController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.PLACE_OF_WORK);
    expect(req.session.userCase.claimantWorkAddressQuestion).toStrictEqual('No');
  });
});
