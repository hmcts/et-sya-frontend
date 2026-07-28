import ClaimantApplicationsController from '../../../main/controllers/ClaimantApplicationsController';
import * as translateTypesOfClaim from '../../../main/controllers/helpers/ApplicationTableRecordTranslationHelper';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls, Roles, TranslationKeys } from '../../../main/definitions/constants';
import { ApplicationTableRecord, CaseState } from '../../../main/definitions/definition';
import * as caseSelectionService from '../../../main/services/CaseSelectionService';
import { mockApplications } from '../mocks/mockApplications';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const getUserCasesMock = jest.spyOn(caseSelectionService, 'getUserCasesByLastModified');
const getUserAppMock = jest.spyOn(caseSelectionService, 'getUserApplications');

describe('Claimant Applications Controller', () => {
  const userCases: CaseWithId[] = [
    {
      id: '12454',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    },
  ];

  it('should render home page if no user cases', async () => {
    getUserCasesMock.mockResolvedValue([]);
    const claimantApplicationsController = new ClaimantApplicationsController();
    const request = mockRequest({});
    const response = mockResponse();

    await claimantApplicationsController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.HOME);
    expect(request.session.hasUserCases).toBe(false);
    expect(request.session.returnUrl).toBeUndefined();
  });

  it('should render claimant applications page', async () => {
    // Own claims ([CREATOR]) return the user's cases; representing ([CLAIMANTNONLEGALREPRESENTATIVE]) returns none.
    getUserCasesMock.mockImplementation(async (_req, role) =>
      role === Roles.CREATOR_ROLE_WITH_BRACKETS ? userCases : []
    );
    getUserAppMock.mockImplementation(cases => (cases.length ? mockApplications : []));
    const claimantApplicationsController = new ClaimantApplicationsController();
    const request = mockRequest({});
    const response = mockResponse();
    const mockHelper = jest.spyOn(translateTypesOfClaim, 'translateTypeOfClaim');
    mockHelper.mockReturnValue(undefined);

    await claimantApplicationsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CLAIMANT_APPLICATIONS,
      expect.objectContaining({
        myClaimsApplications: mockApplications,
        representingApplications: [],
        showTabs: false,
        currentUrl: PageUrls.CLAIMANT_APPLICATIONS,
      })
    );
    expect(request.session.hasUserCases).toBe(true);
    expect(request.session.userCases).toEqual(userCases);
  });

  it('should split applications into "My claims" and "Representing" and show tabs when both exist', async () => {
    const creatorCase = { id: 'personal-1' } as CaseWithId;
    const repCase = { id: 'rep-1' } as CaseWithId;
    const personalApp = { userCase: { id: 'personal-1' } } as ApplicationTableRecord;
    const representingApp = { userCase: { id: 'rep-1' } } as ApplicationTableRecord;
    // Each role returns its own case; getUserApplications maps each case list to its record.
    getUserCasesMock.mockImplementation(async (_req, role) =>
      role === Roles.CLAIMANT_NON_LEGAL_REP_WITH_BRACKETS ? [repCase] : [creatorCase]
    );
    getUserAppMock.mockImplementation(cases => (cases.some(c => c.id === 'rep-1') ? [representingApp] : [personalApp]));

    const request = mockRequest({});
    const response = mockResponse();
    await new ClaimantApplicationsController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CLAIMANT_APPLICATIONS,
      expect.objectContaining({
        myClaimsApplications: [personalApp],
        representingApplications: [representingApp],
        showTabs: true,
      })
    );
  });

  it('should not show tabs when the user has only one type of claim', async () => {
    const repCase = { id: 'rep-1' } as CaseWithId;
    const representingApp = { userCase: { id: 'rep-1' } } as ApplicationTableRecord;
    // Only the representing ([CLAIMANTNONLEGALREPRESENTATIVE]) role returns a case.
    getUserCasesMock.mockImplementation(async (_req, role) =>
      role === Roles.CLAIMANT_NON_LEGAL_REP_WITH_BRACKETS ? [repCase] : []
    );
    getUserAppMock.mockImplementation(cases => (cases.some(c => c.id === 'rep-1') ? [representingApp] : []));

    const request = mockRequest({});
    const response = mockResponse();
    await new ClaimantApplicationsController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CLAIMANT_APPLICATIONS,
      expect.objectContaining({
        myClaimsApplications: [],
        representingApplications: [representingApp],
        showTabs: false,
      })
    );
  });

  it('should log and render claimant applications page when accessed via nav-link', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    const claimantApplicationsController = new ClaimantApplicationsController();
    const request = mockRequest({});
    request.query = { src: 'nav-link' };
    const response = mockResponse();

    await claimantApplicationsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_APPLICATIONS, expect.anything());
  });

  it('should log and render claimant applications page when accessed via side-bar-link', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    const claimantApplicationsController = new ClaimantApplicationsController();
    const request = mockRequest({});
    request.query = { src: 'side-bar-link' };
    const response = mockResponse();

    await claimantApplicationsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_APPLICATIONS, expect.anything());
  });
});
