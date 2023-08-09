import NoAcasNumberController from '../../../main/controllers/NoAcasNumberController';
import RespondentNameController from '../../../main/controllers/RespondentNameController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, RespondentType, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Respondent Name Controller', () => {
  const t = {
    respondentName: {},
    common: {},
  };

  it('should render the Respondent Name controller page when respondents empty', () => {
    const controller = new RespondentNameController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_NAME, expect.anything());
  });

  it('should render the Respondent Name controller page when respondent exists', () => {
    const controller = new RespondentNameController();

    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_NAME, expect.anything());
  });

  it('should create new respondent and add the respondent name to the session', async () => {
    const body = {
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
    };

    const controller = new RespondentNameController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/respondent-postcode-enter');
    expect(req.session.userCase.respondents[0]).toStrictEqual({
      respondentNumber: 1,
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
      respondentName: 'George Costanza',
      respondentOrganisation: undefined,
    });
  });

  it('should update selected respondent with new respondent name', async () => {
    const body = {
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
    };

    const controller = new RespondentNameController();

    const req = mockRequest({ body });
    const res = mockResponse();

    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/respondent-postcode-enter');
    expect(req.session.userCase.respondents[0]).toStrictEqual({
      respondentNumber: 1,
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
      respondentName: 'George Costanza',
      respondentOrganisation: undefined,
    });
  });

  it('should redirect to respondent details check if there is a returnUrl', async () => {
    const body = {
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
    };

    const controller = new RespondentNameController();

    const req = mockRequest({ body });
    req.session.returnUrl = PageUrls.RESPONDENT_DETAILS_CHECK;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DETAILS_CHECK);
  });
  it('should redirect to your claim has been saved page and save respondent name when a a name is entered and save as draft clicked', async () => {
    const body = {
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
      saveForLater: true,
    };

    const controller = new RespondentNameController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
  it('should redirect to your claim has been saved page when save as draft selected and no respondent name entered', async () => {
    const body = { saveForLater: true };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });
  it('should redirect to undefined when save as draft not selected and no respondent name entered', async () => {
    const body = { saveForLater: false };

    const controller = new NoAcasNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(undefined);
  });

  it('should add respondent name to the session userCase', async () => {
    const body = {
      respondentType: RespondentType.INDIVIDUAL,
      respondentFirstName: 'George',
      respondentLastName: 'Costanza',
    };
    const controller = new RespondentNameController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.respondents[0].respondentType).toStrictEqual(RespondentType.INDIVIDUAL);
    expect(req.session.userCase.respondents[0].respondentFirstName).toStrictEqual('George');
    expect(req.session.userCase.respondents[0].respondentLastName).toStrictEqual('Costanza');
    expect(req.session.userCase.respondents[0].respondentNumber).toStrictEqual(1);
  });
});
