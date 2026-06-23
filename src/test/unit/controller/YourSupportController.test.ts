import YourSupportController from '../../../main/controllers/YourSupportController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseFlags, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, languages } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import * as CaseService from '../../../main/services/CaseService';
import * as CuiService from '../../../main/services/CuiService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockedApiData } from '../mocks/mockedApiData';

const handleUpdateDraftCaseMock = jest
  .spyOn(CaseHelper, 'handleUpdateDraftCase')
  .mockImplementation(() => Promise.resolve());

describe('Your Support Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to personal details check when no support is selected for a draft claim', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.NO },
      userCase: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(handleUpdateDraftCaseMock).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
  });

  it('should redirect to the return url when support is changed from check your answers', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.NO },
      session: { returnUrl: PageUrls.CHECK_ANSWERS + languages.ENGLISH_URL_PARAMETER },
      userCase: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS + languages.ENGLISH_URL_PARAMETER);
    expect(req.session.returnUrl).toBeUndefined();
  });

  it('should redirect to personal details check after a draft CUI journey is submitted', async () => {
    const claimantExternalFlags: CaseFlags = {
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [],
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: claimantExternalFlags,
    });
    const updateDraftCase = jest.fn().mockResolvedValue({
      data: {
        ...mockedApiData,
        case_data: {
          ...mockedApiData.case_data,
          claimantExternalFlags,
        },
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue({ updateDraftCase } as unknown as CaseService.CaseApi);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(getJourneyData).toHaveBeenCalledWith('journey-id', { serviceToken: 's2s-token' });
    expect(updateDraftCase).toHaveBeenCalled();
    expect(req.session.userCase.claimantExternalFlags).toEqual(claimantExternalFlags);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
  });
});
