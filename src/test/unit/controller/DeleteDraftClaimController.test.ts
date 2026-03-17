import AxiosInstance, { AxiosResponse } from 'axios';

import DeleteDraftClaimController from '../../../main/controllers/DeleteDraftClaimController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/controllers/helpers/CaseHelpers', () => ({
  deleteDraftCase: jest.fn(),
}));
jest.mock('../../../main/controllers/helpers/RouterHelpers', () => ({
  getLanguageParam: jest.fn(() => ''),
}));

jest.mock('axios');
const mockCaseApi = {
  axios: AxiosInstance,
  getUserCase: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      id: '1234',
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

const { deleteDraftCase } = require('../../../main/controllers/helpers/CaseHelpers');

describe('DeleteDraftClaimController', () => {
  let controller: DeleteDraftClaimController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new DeleteDraftClaimController();
    req = mockRequest({
      t: jest.fn().mockReturnValue({ key: 'value' }),
    }) as ReturnType<typeof mockRequest>;
    req.url = '/delete-draft-claim/1234';
    req.params = { id: '1234' };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should render the delete draft claim page with correct params', async () => {
      await controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.DELETE_DRAFT_CLAIM,
        expect.objectContaining({
          caseReference: '1234',
          deleteButtonUrl: expect.any(String),
          cancelLink: expect.any(String),
        })
      );
    });

    it('should set cancelLink to CLAIMANT_APPLICATIONS if redirect query param is claimant-applications', async () => {
      req.query = { redirect: 'claimant-applications' };
      await controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.DELETE_DRAFT_CLAIM,
        expect.objectContaining({
          cancelLink: PageUrls.CLAIMANT_APPLICATIONS,
        })
      );
    });

    it('should set cancelLink to CLAIM_STEPS if redirect query param is claim-steps', async () => {
      req.query = { redirect: 'claim-steps' };
      req.params = { id: 'undefined' };
      req.session.userCase = { id: '12345' } as never;
      await controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.DELETE_DRAFT_CLAIM,
        expect.objectContaining({
          cancelLink: PageUrls.CLAIM_STEPS,
          caseReference: '12345',
        })
      );
    });

    it('should fall back to undefined for cancelLink if redirect parameter is not provided', async () => {
      req.query = {};
      await controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.DELETE_DRAFT_CLAIM,
        expect.objectContaining({
          cancelLink: 'undefined',
        })
      );
    });
  });

  describe('POST', () => {
    it('should call deleteDraftCase and redirect to claimant applications on success', async () => {
      deleteDraftCase.mockResolvedValue();
      await controller.post(req, res);
      expect(deleteDraftCase).toHaveBeenCalledWith(req, expect.anything());
      expect(req.session.deletedCaseIds).toContain('1234');
      expect(req.session.save).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should redirect to NOT_FOUND on error', async () => {
      deleteDraftCase.mockRejectedValue(new Error('fail'));
      await controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });
});
