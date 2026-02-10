import DeleteDraftClaimController from '../../../main/controllers/DeleteDraftClaimController';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/controllers/helpers/CaseHelpers', () => ({
  deleteDraftCase: jest.fn(),
}));
jest.mock('../../../main/controllers/helpers/RouterHelpers', () => ({
  getLanguageParam: jest.fn(() => ''),
}));

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
          backToCaseUrl: expect.any(String),
        })
      );
    });
  });

  describe('POST', () => {
    it('should redirect to NOT_FOUND on error', async () => {
      deleteDraftCase.mockRejectedValue(new Error('fail'));
      await controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });
});
