import ClaimantRespondentDetailsCheckController from '../../../../main/controllers/non-hmcts/ClaimantRespondentDetailsCheckController';
import { Respondent, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

const completeRespondent: Respondent = {
  respondentName: 'Acme Ltd',
  respondentAddress1: '1 Test Street',
  respondentAddressTown: 'London',
  respondentAddressCountry: 'England',
  acasCert: YesOrNo.YES,
  acasCertNum: 'A123456/21/12345',
};

describe('ClaimantRespondentDetailsCheckController', () => {
  const t = {
    'claimant-respondent-details-check': {},
    common: {},
  };

  it('should render the claimant respondent details check page on GET', () => {
    const controller = new ClaimantRespondentDetailsCheckController();
    const response = mockResponse();
    const request = mockRequest({ t, userCase: { respondents: [completeRespondent] } });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_RESPONDENT_DETAILS_CHECK, expect.anything());
  });

  it('should render all respondents in GET context', () => {
    const controller = new ClaimantRespondentDetailsCheckController();
    const response = mockResponse();
    const request = mockRequest({
      t,
      userCase: { respondents: [completeRespondent, { ...completeRespondent, respondentName: 'Beta Ltd' }] },
    });
    controller.get(request, response);
    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.respondents).toHaveLength(2);
  });

  it('should redirect to CLAIMANT_RESPONDENT_SECTION_CHECK on POST', async () => {
    const controller = new ClaimantRespondentDetailsCheckController();
    const req = mockRequest({ body: {}, userCase: { respondents: [completeRespondent] } });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_SECTION_CHECK);
  });
});
