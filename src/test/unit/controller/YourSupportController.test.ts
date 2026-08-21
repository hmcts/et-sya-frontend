import YourSupportController from '../../../main/controllers/YourSupportController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseFlags, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, languages } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import * as CuiService from '../../../main/services/CuiService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const handleUpdateDraftCaseMock = jest
  .spyOn(CaseHelper, 'handleUpdateDraftCase')
  .mockImplementation(() => Promise.resolve());
const handleUpdateSubmittedCaseFlagsMock = jest
  .spyOn(CaseHelper, 'handleUpdateSubmittedCaseFlags')
  .mockImplementation(() => Promise.resolve());

const yourSupportTranslations = {
  continueToQuestions: 'Continue to the questions',
  details: [] as unknown[],
  detailsSummary: {},
  errors: {},
  errorSummaryTitle: 'There is a problem',
  h1: 'Tell us if you need support',
  legend: 'Your Support',
  noSupport: 'I do not need any support at this time',
  p: 'Some people need support.',
};

const confirmationTranslations = {
  buttonText: 'Continue your claim',
  h1: 'You have added your support request to your claim',
  h2: 'What happens next',
  p: 'Once you submit your claim, the tribunal will review your support request.',
};

const submittedConfirmationTranslations = {
  buttonText: 'Return to case overview',
  h1: 'You have added your support request',
  h2: 'What happens next',
  p: 'The tribunal will review your support request.',
};

const getSupportFlag = () => ({
  id: 'support-flag-id',
  value: {
    name: 'Support',
    flagCode: 'RA0001',
    status: 'Active',
  },
});

describe('Your Support Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the draft support page with the no support option', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
    });
    (req as any).t = jest.fn().mockReturnValue(yourSupportTranslations);
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'your-support',
      expect.objectContaining({
        showNoSupport: true,
      })
    );
  });

  it('should render the submitted support page without the no support option', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    (req as any).t = jest.fn().mockReturnValue(yourSupportTranslations);
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'your-support',
      expect.objectContaining({
        cancelLink: PageUrls.CITIZEN_HUB.replace(':caseId', '1234'),
        showNoSupport: false,
      })
    );
  });

  it('should redirect to claimant applications when the support page cannot be accessed', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: undefined,
        state: CaseState.SUBMITTED,
      },
    });
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
  });

  it('should redirect to claimant applications when support is posted without an accessible case', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.NO },
      userCase: {
        id: undefined,
        state: CaseState.SUBMITTED,
      },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
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

  it('should redirect back with a required error when no support option is selected', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      body: {},
      userCase: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'reasonableAdjustments', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
  });

  it('should redirect home when CUI starts without returning a journey url', async () => {
    const startJourney = jest.fn().mockResolvedValue({});
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ startJourney } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.YES },
      userCase: {
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.HOME);
  });

  it('should redirect back to your support when CUI journey startup fails', async () => {
    const startJourney = jest.fn().mockRejectedValue(new Error('CUI unavailable'));
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ startJourney } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.YES },
      userCase: {
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'yourSupportRedirect', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
  });

  it('should only send CUI-supported existing flag fields when starting a submitted support journey', async () => {
    const startJourney = jest.fn().mockResolvedValue({ url: 'https://localhost:3100/dc/p/journey-id' });
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ startJourney } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.YES },
      session: {
        user: {
          accessToken: 'idam-token',
        },
      },
      userCase: {
        claimantExternalFlags: {
          partyName: 'Jane Doe',
          roleOnCase: 'Claimant',
          groupId: 'ccd-group-id',
          visibility: 'External',
          details: [
            {
              id: 'flag-id',
              value: {
                name: 'Support filling in forms',
                name_cy: 'Cymorth i lenwi ffurflenni',
                dateTimeCreated: '2026-06-23T13:33:58.833Z',
                path: [
                  {
                    id: 'path-id',
                    name: 'Party',
                    extraPathField: 'not sent to CUI',
                  },
                ],
                hearingRelevant: 'No',
                flagCode: 'RA0018',
                status: 'Requested',
                availableExternally: 'Yes',
                flagComment: 'existing comment',
                requestReason: 'not sent to CUI',
              },
            },
          ],
        } as unknown as CaseFlags,
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.post(req, res);

    expect(startJourney).toHaveBeenCalledWith(
      expect.objectContaining({
        existingFlags: {
          partyName: 'Jane Doe',
          roleOnCase: 'Claimant',
          details: [
            {
              id: 'flag-id',
              value: {
                name: 'Support filling in forms',
                name_cy: 'Cymorth i lenwi ffurflenni',
                dateTimeCreated: '2026-06-23T13:33:58.833Z',
                path: [
                  {
                    id: 'path-id',
                    name: 'Party',
                  },
                ],
                hearingRelevant: 'No',
                flagCode: 'RA0018',
                status: 'Requested',
                availableExternally: 'Yes',
                flagComment: 'existing comment',
              },
            },
          ],
        },
      }),
      {
        idamToken: 'idam-token',
        serviceToken: 's2s-token',
      }
    );
    expect(res.redirect).toHaveBeenCalledWith('https://localhost:3100/dc/p/journey-id');
  });

  it('should use the logged-in user name as party name when starting a CUI journey', async () => {
    const startJourney = jest.fn().mockResolvedValue({ url: 'https://localhost:3100/dc/p/journey-id' });
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ startJourney } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      body: { reasonableAdjustments: YesOrNo.YES },
      session: {
        user: {
          accessToken: 'idam-token',
          email: 'jane@example.com',
          familyName: 'User',
          givenName: 'Logged-in',
          id: 'user-id',
          isCitizen: true,
        },
      },
      userCase: {
        claimantExternalFlags: {
          partyName: 'Jane Old',
          roleOnCase: 'Claimant',
          details: [],
        },
        firstName: 'Jane',
        id: '1234',
        lastName: 'Current',
        state: CaseState.SUBMITTED,
      },
    });
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.post(req, res);

    expect(startJourney).toHaveBeenCalledWith(
      expect.objectContaining({
        existingFlags: expect.objectContaining({
          partyName: 'Logged-in User',
        }),
      }),
      expect.anything()
    );
    expect(res.redirect).toHaveBeenCalledWith('https://localhost:3100/dc/p/journey-id');
  });

  it('should redirect to the confirmation page after a draft CUI journey is submitted', async () => {
    const claimantExternalFlags: CaseFlags = {
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [getSupportFlag()],
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: claimantExternalFlags,
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

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
    expect(handleUpdateDraftCaseMock).toHaveBeenCalledWith(req, expect.anything());
    expect(req.session.userCase.claimantExternalFlags).toEqual(claimantExternalFlags);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT_CONFIRMATION);
  });

  it('should update submitted case flags after a submitted CUI journey is submitted', async () => {
    const claimantExternalFlags: CaseFlags = {
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [getSupportFlag()],
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: claimantExternalFlags,
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(handleUpdateDraftCaseMock).not.toHaveBeenCalled();
    expect(handleUpdateSubmittedCaseFlagsMock).toHaveBeenCalledWith(req, expect.anything());
    expect(req.session.userCase.claimantExternalFlags).toEqual(claimantExternalFlags);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT_SUBMITTED_CONFIRMATION);
  });

  it('should redirect back without saving when a submitted CUI callback has no returned flag changes', async () => {
    const existingFlags: CaseFlags = {
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [
        {
          id: 'existing-flag-id',
          value: {
            name: 'Support filling in forms',
            flagCode: 'RA0018',
            status: 'Active',
          },
        },
      ],
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [],
      },
      flagsAsSupplied: {
        roleOnCase: 'Claimant',
        details: [],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        claimantExternalFlags: existingFlags,
        id: '1234',
        state: CaseState.SUBMITTED,
      },
      session: {
        returnUrl: PageUrls.CHECK_ANSWERS,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(handleUpdateDraftCaseMock).not.toHaveBeenCalled();
    expect(handleUpdateSubmittedCaseFlagsMock).not.toHaveBeenCalled();
    expect(req.session.userCase.claimantExternalFlags?.details).toEqual(existingFlags.details);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CHECK_ANSWERS);
    expect(req.session.returnUrl).toBeUndefined();
  });

  it('should save when only flags as supplied has details', async () => {
    const existingFlag = {
      id: 'existing-flag-id',
      value: {
        name: 'Support filling in forms',
        flagCode: 'RA0018',
        status: 'Active',
      },
    };
    const modifiedExistingFlag = {
      ...existingFlag,
      value: {
        ...existingFlag.value,
        status: 'Inactive',
        flagUpdateComment: 'Updated by CUI',
      },
    };
    const existingFlags: CaseFlags = {
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [existingFlag],
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [],
      },
      flagsAsSupplied: {
        partyName: 'Jane Doe',
        roleOnCase: 'Claimant',
        details: [modifiedExistingFlag],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        claimantExternalFlags: existingFlags,
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(handleUpdateSubmittedCaseFlagsMock).toHaveBeenCalledWith(req, expect.anything());
    expect(req.session.userCase.claimantExternalFlags?.details).toEqual([modifiedExistingFlag]);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT_SUBMITTED_CONFIRMATION);
  });

  it('should save supplied flag changes with replacement flags', async () => {
    const existingFlag = {
      id: 'existing-flag-id',
      value: {
        name: 'Support filling in forms',
        flagCode: 'RA0018',
        status: 'Active',
      },
    };
    const modifiedExistingFlag = {
      ...existingFlag,
      value: {
        ...existingFlag.value,
        status: 'Inactive',
        flagUpdateComment: 'Updated by CUI',
      },
    };
    const newFlag = {
      value: {
        name: 'Screen reader support',
        flagCode: 'RA0042',
        status: 'Active',
      },
    };
    const existingFlags: CaseFlags = {
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [existingFlag],
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        partyName: 'Jane Doe',
        roleOnCase: 'Claimant',
        details: [newFlag],
      },
      flagsAsSupplied: {
        partyName: 'Jane Doe',
        roleOnCase: 'Claimant',
        details: [modifiedExistingFlag],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        claimantExternalFlags: existingFlags,
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(handleUpdateSubmittedCaseFlagsMock).toHaveBeenCalledWith(req, expect.anything());
    expect(req.session.userCase.claimantExternalFlags?.details).toEqual([modifiedExistingFlag, newFlag]);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT_SUBMITTED_CONFIRMATION);
  });

  it('should append replacement flags without overwriting existing flag nodes', async () => {
    const existingFlag = {
      id: 'existing-flag-id',
      value: {
        name: 'Support filling in forms',
        flagCode: 'RA0018',
        status: 'Active',
      },
    };
    const replacementFlag = {
      value: {
        name: 'Support filling in forms',
        flagCode: 'RA0018',
        status: 'Active',
      },
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [replacementFlag],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        claimantExternalFlags: {
          partyName: 'Jane Doe',
          roleOnCase: 'Claimant',
          details: [existingFlag],
        },
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(req.session.userCase.claimantExternalFlags?.details).toEqual([existingFlag, replacementFlag]);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT_CONFIRMATION);
  });

  it('should replace existing flags that have the same id as a replacement flag', async () => {
    const existingFlag = {
      id: 'same-flag-id',
      value: {
        name: 'Support filling in forms',
        flagCode: 'RA0018',
        status: 'Active',
      },
    };
    const replacementFlag = {
      id: 'same-flag-id',
      value: {
        name: 'Support filling in forms',
        flagCode: 'RA0018',
        status: 'Inactive',
        flagUpdateComment: 'Updated in CUI',
      },
    };
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [replacementFlag],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        claimantExternalFlags: {
          partyName: 'Jane Doe',
          roleOnCase: 'Claimant',
          details: [existingFlag],
        },
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(req.session.userCase.claimantExternalFlags?.details).toEqual([replacementFlag]);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT_CONFIRMATION);
  });

  it('should return to the case page without saving flags when the CUI journey is not submitted', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'cancel',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

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

    expect(handleUpdateDraftCaseMock).not.toHaveBeenCalled();
    expect(handleUpdateSubmittedCaseFlagsMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.PERSONAL_DETAILS_CHECK);
  });

  it('should redirect home when CUI journey correlation does not match the case', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: 'different-case-id',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

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

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.HOME);
  });

  it('should redirect back without saving when a submitted CUI journey has no replacement flags', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: undefined,
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(handleUpdateDraftCaseMock).not.toHaveBeenCalled();
    expect(handleUpdateSubmittedCaseFlagsMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CITIZEN_HUB.replace(':caseId', '1234'));
  });

  it('should redirect home when replacement flags cannot be saved to a draft case', async () => {
    handleUpdateDraftCaseMock.mockImplementationOnce(async req => {
      req.session.userCase.updateDraftCaseError = 'Unable to save draft';
    });
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

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

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.HOME);
  });

  it('should render the draft support confirmation page', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    (req as any).t = jest.fn().mockReturnValue(confirmationTranslations);
    const res = mockResponse();

    await controller.confirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'your-support-confirmation',
      expect.objectContaining({
        buttonText: confirmationTranslations.buttonText,
        link: PageUrls.PERSONAL_DETAILS_CHECK,
      })
    );
  });

  it('should render the submitted support confirmation page', async () => {
    const controller = new YourSupportController();
    const req = mockRequest({
      userCase: {
        id: '1234',
        state: CaseState.SUBMITTED,
      },
    });
    (req as any).t = jest.fn().mockReturnValue(submittedConfirmationTranslations);
    const res = mockResponse();

    await controller.submittedConfirmation(req, res);

    expect(res.render).toHaveBeenCalledWith(
      'your-support-submitted-confirmation',
      expect.objectContaining({
        buttonText: submittedConfirmationTranslations.buttonText,
        link: PageUrls.CITIZEN_HUB.replace(':caseId', '1234'),
      })
    );
  });

  it('should use the claimant name as party name when CUI replacement flags do not include one', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        firstName: 'Jane',
        id: '1234',
        lastName: 'Doe',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(req.session.userCase.claimantExternalFlags).toEqual({
      partyName: 'Jane Doe',
      roleOnCase: 'Claimant',
      details: [getSupportFlag()],
    });
  });

  it('should use the current claimant name when existing flags have an old party name', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      userCase: {
        claimantExternalFlags: {
          partyName: 'Jane Old',
          roleOnCase: 'Claimant',
          details: [],
        },
        firstName: 'Jane',
        id: '1234',
        lastName: 'Current',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      },
    });
    req.params = { id: 'journey-id' };
    req.headers = { 'x-forwarded-host': 'localhost:3002' };
    req.app = { locals: {} } as typeof req.app;
    const res = mockResponse();

    await controller.callback(req, res);

    expect(req.session.userCase.claimantExternalFlags?.partyName).toBe('Jane Current');
  });

  it('should use the logged-in user name as party name when case name is not available', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      session: {
        user: {
          accessToken: 'idam-token',
          email: 'jane@example.com',
          familyName: 'User',
          givenName: 'Logged-in',
          id: 'user-id',
          isCitizen: true,
        },
      },
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

    expect(req.session.userCase.claimantExternalFlags?.partyName).toBe('Logged-in User');
  });

  it('should use Claimant as party name when no name is available', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

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

    expect(req.session.userCase.claimantExternalFlags?.partyName).toBe('Claimant');
  });

  it('should use the logged-in user name before the session claimant name', async () => {
    const getOneTimeToken = jest.fn();
    const getToken = jest.fn().mockResolvedValue('s2s-token');
    const getJourneyData = jest.fn().mockResolvedValue({
      action: 'submit',
      correlationId: '1234',
      replacementFlags: {
        roleOnCase: 'Claimant',
        details: [getSupportFlag()],
      },
    });
    jest.spyOn(CuiService, 'getCuiService').mockReturnValue({ getJourneyData } as unknown as CuiService.CUIClient);

    const controller = new YourSupportController({ getOneTimeToken, getToken });
    const req = mockRequest({
      session: {
        claimantFirstName: 'Session',
        claimantLastName: 'Claimant',
        user: {
          accessToken: 'idam-token',
          email: 'jane@example.com',
          familyName: 'User',
          givenName: 'Logged-in',
          id: 'user-id',
          isCitizen: true,
        },
      },
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

    expect(req.session.userCase.claimantExternalFlags?.partyName).toBe('Logged-in User');
  });
});
