import RespondentAddressNonUkController from '../../../main/controllers/RespondentAddressNonUkController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Respondent Address Non UK Controller', () => {
  const t = {
    respondentAddress: {},
    common: {},
  };

  it('should render the Respondent Address controller page', () => {
    const controller = new RespondentAddressNonUkController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = userCaseWithRespondent;
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ADDRESS, expect.anything());
  });

  it('should render the Work Address page on post', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressPostcode: 'AB1 2CD',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressNonUkController();
    const response = mockResponse();
    const request = mockRequest({ body });
    request.session.userCase = userCaseWithRespondent;
    await controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/work-address');
  });

  it('should render the Work Address page on post when Postcode not exist', async () => {
    const body = {
      respondentAddress1: '10 test street',
      respondentAddressTown: 'test',
      respondentAddressCountry: 'Test Country',
    };
    const controller = new RespondentAddressNonUkController();
    const response = mockResponse();
    const request = mockRequest({ body });
    request.session.userCase = userCaseWithRespondent;
    await controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/respondent/1/work-address');
  });
});
