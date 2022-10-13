import ClaimantApplicationsController from '../../../main/controllers/ClaimantApplicationsController';
import * as translateTypesOfClaim from '../../../main/controllers/helpers/TranslateTypesOfClaim';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
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
  });

  it('should render claimant applications page', async () => {
    getUserCasesMock.mockResolvedValue(userCases);
    getUserAppMock.mockReturnValue(mockApplications);
    const claimantApplicationsController = new ClaimantApplicationsController();
    const request = mockRequest({});
    const response = mockResponse();
    const mockHelper = jest.spyOn(translateTypesOfClaim, 'retrieveTypeOfClaim');
    mockHelper.mockReturnValue(undefined);

    await claimantApplicationsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_APPLICATIONS, expect.anything());
  });
});
