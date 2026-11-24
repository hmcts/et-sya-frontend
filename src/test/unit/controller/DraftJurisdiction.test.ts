import { Application } from 'express';

import { getUserDetails } from '../../../main/auth';
import ClaimJurisdictionSelectionController from '../../../main/controllers/ClaimJurisdictionSelectionController';
import StepsToMakingYourClaimController from '../../../main/controllers/StepsToMakingYourClaimController';
import StepsToMakingYourClaimNonHmctsController from '../../../main/controllers/StepsToMakingYourClaimNonHmctsController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseType, CaseTypeId, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState, TypesOfClaim } from '../../../main/definitions/definition';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import { idamCallbackHandler } from '../../../main/modules/oidc';
import { getPreloginCaseData } from '../../../main/services/CacheService';
import { selectUserCase } from '../../../main/services/CaseSelectionService';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('../../../main/auth');
jest.mock('../../../main/services/CacheService');
jest.mock('../../../main/services/CaseService');
jest.mock('../../../main/logger', () => ({
  getLogger: () => ({ info: jest.fn(), error: jest.fn(), warn: jest.fn() }),
}));

const guid = 'new-claim-guid';
const caseApi = { createCase: jest.fn(), getUserCase: jest.fn() };
const cachedCaseData = (caseTypeId: CaseTypeId, represented = YesOrNo.NO): string =>
  JSON.stringify([
    ['claimJurisdiction', caseTypeId],
    ['claimantRepresentedQuestion', represented],
    ['caseType', CaseType.SINGLE],
    ['typeOfClaim', JSON.stringify([TypesOfClaim.PAY_RELATED_CLAIM])],
  ]);

const createdCase = (caseTypeId?: CaseTypeId): CaseApiDataResponse => ({
  id: '1234',
  case_type_id: caseTypeId,
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  created_date: '2026-10-23T10:00:00',
  last_modified: '2026-10-23T10:00:00',
});

const requestWithCachedJourney = (userCase: Partial<CaseWithId> = {}) => {
  const request = mockRequest({
    body: {},
    userCase: {
      caseType: CaseType.SINGLE,
      claimantRepresentedQuestion: YesOrNo.NO,
      typeOfClaim: [TypesOfClaim.DISCRIMINATION],
      ...userCase,
    },
    session: { guid, user: mockUserDetails },
  });
  request.app = {} as Application;
  request.app.locals = { redisClient: {} };
  request.url = PageUrls.CLAIM_STEPS;
  return request;
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(getCaseApi).mockReturnValue(caseApi as unknown as CaseApi);
  jest.mocked(getUserDetails).mockResolvedValue(mockUserDetails);
  jest
    .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
    .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe.each([
  { name: 'claimant', Controller: StepsToMakingYourClaimController, represented: YesOrNo.NO },
  { name: 'representative', Controller: StepsToMakingYourClaimNonHmctsController, represented: YesOrNo.YES },
])('$name draft jurisdiction', ({ Controller, represented }) => {
  it.each([CaseTypeId.SCOTLAND, CaseTypeId.ENGLAND_WALES, undefined])(
    'does not apply another journey to an existing draft with jurisdiction %s',
    async caseTypeId => {
      const cachedJurisdiction =
        caseTypeId === CaseTypeId.ENGLAND_WALES ? CaseTypeId.SCOTLAND : CaseTypeId.ENGLAND_WALES;
      jest.mocked(getPreloginCaseData).mockResolvedValue(cachedCaseData(cachedJurisdiction));
      const request = requestWithCachedJourney({ caseTypeId, claimantRepresentedQuestion: represented });
      const savedCase = { ...request.session.userCase };

      await new Controller().get(request, mockResponse());

      expect(request.session.userCase).toEqual(savedCase);
      expect(getPreloginCaseData).not.toHaveBeenCalled();
      expect(caseApi.createCase).not.toHaveBeenCalled();
    }
  );

  it.each([CaseTypeId.SCOTLAND, CaseTypeId.ENGLAND_WALES, undefined])(
    'initialises a new draft once when the creation response jurisdiction is %s',
    async caseTypeId => {
      const caseData = cachedCaseData(CaseTypeId.SCOTLAND, represented);
      jest.mocked(getPreloginCaseData).mockResolvedValue(caseData);
      caseApi.createCase.mockResolvedValue({ data: createdCase(caseTypeId) });
      const request = requestWithCachedJourney({ id: undefined });
      const controller = new Controller();
      const response = mockResponse();

      await controller.get(request, response);

      expect(request.session.userCase.caseTypeId).toBe(caseTypeId ?? CaseTypeId.SCOTLAND);
      expect(request.session.userCase.claimantRepresentedQuestion).toBe(represented);
      expect(request.session.guid).toBeUndefined();
      expect(caseApi.createCase).toHaveBeenCalledWith(caseData, mockUserDetails);
      expect(response.render).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM] })
      );

      await controller.get(request, mockResponse());

      expect(getPreloginCaseData).toHaveBeenCalledTimes(1);
      expect(caseApi.createCase).toHaveBeenCalledTimes(1);
    }
  );

  it('retains the cached journey when draft creation fails so it can be retried', async () => {
    jest.mocked(getPreloginCaseData).mockResolvedValue(cachedCaseData(CaseTypeId.SCOTLAND, represented));
    caseApi.createCase.mockRejectedValue(new Error('Draft creation failed'));
    const request = requestWithCachedJourney({ id: undefined });

    await expect(new Controller().get(request, mockResponse())).rejects.toThrow('Draft creation failed');

    expect(request.session.guid).toBe(guid);
    expect(request.session.userCase.id).toBeUndefined();
  });
});

describe('switching claims', () => {
  it('clears the previous cached journey when starting a new claim', async () => {
    const request = requestWithCachedJourney({ caseTypeId: CaseTypeId.SCOTLAND });

    await selectUserCase(request, mockResponse(), 'newClaim');

    expect(request.session.guid).toBeUndefined();
    expect(request.session.userCase).toBeUndefined();
  });

  it('keeps Your support on both Scottish drafts after abandoning an England/Wales journey', async () => {
    const request = requestWithCachedJourney();
    request.url = PageUrls.CLAIM_JURISDICTION_SELECTION;
    request.body = { claimJurisdiction: CaseTypeId.ENGLAND_WALES };
    new ClaimJurisdictionSelectionController().post(request, mockResponse());
    jest.mocked(getPreloginCaseData).mockResolvedValue(cachedCaseData(CaseTypeId.ENGLAND_WALES));
    caseApi.getUserCase.mockImplementation(async (id: string) => ({
      data: { ...createdCase(CaseTypeId.SCOTLAND), id },
    }));

    for (const id of ['1234', '5678']) {
      await selectUserCase(request, mockResponse(), id);

      expect(request.session.guid).toBeUndefined();
      request.url = PageUrls.CLAIM_STEPS;
      const response = mockResponse();
      await new StepsToMakingYourClaimController().get(request, response);

      expect(request.session.userCase.id).toBe(id);
      expect(request.session.userCase.caseTypeId).toBe(CaseTypeId.SCOTLAND);
      const renderData = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderData.sections[0].links).toEqual(
        expect.arrayContaining([expect.objectContaining({ url: `${PageUrls.YOUR_SUPPORT}?redirect=CLAIM_STEPS` })])
      );
    }
    expect(getPreloginCaseData).not.toHaveBeenCalled();
  });
});

describe('draft creation during login', () => {
  it.each([CaseTypeId.SCOTLAND, CaseTypeId.ENGLAND_WALES, undefined])(
    'initialises jurisdiction and consumes the cached journey when the API returns %s',
    async caseTypeId => {
      jest.mocked(getPreloginCaseData).mockResolvedValue(cachedCaseData(CaseTypeId.SCOTLAND));
      caseApi.createCase.mockResolvedValue({ data: createdCase(caseTypeId) });
      const request = requestWithCachedJourney();
      request.query = { code: 'test-code', state: `${guid}-en` };
      const response = mockResponse();

      await idamCallbackHandler(request, response, jest.fn(), 'https://example.test');

      expect(request.session.userCase.caseTypeId).toBe(caseTypeId ?? CaseTypeId.SCOTLAND);
      expect(request.session.guid).toBeUndefined();
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.NEW_ACCOUNT_LANDING}?lng=en`);
    }
  );

  it('retains the cached journey when draft creation fails during login', async () => {
    jest.mocked(getPreloginCaseData).mockResolvedValue(cachedCaseData(CaseTypeId.SCOTLAND));
    caseApi.createCase.mockRejectedValue(new Error('Draft creation failed'));
    const request = requestWithCachedJourney();
    request.query = { code: 'test-code', state: `${guid}-en` };

    await idamCallbackHandler(request, mockResponse(), jest.fn(), 'https://example.test');

    expect(request.session.guid).toBe(guid);
  });
});
