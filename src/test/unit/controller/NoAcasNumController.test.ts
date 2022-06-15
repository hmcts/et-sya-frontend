import NoAcasNumberController from '../../../main/controllers/NoAcasNumberController';
import { NoAcasNumberReason } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

describe('No Acas number Controller', () => {
  const t = {
    noAcasReason: {},
    common: {},
  };

  it('should render the no acas cert controller page', () => {
    const controller = new NoAcasNumberController();

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NO_ACAS_NUMBER, expect.anything());
  });

  it('should redirect to respondent details check when an answer is selected', () => {
    const body = { noAcasReason: NoAcasNumberReason.ANOTHER };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });
});
