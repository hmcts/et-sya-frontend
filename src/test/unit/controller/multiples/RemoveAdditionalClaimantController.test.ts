import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RemoveAdditionalClaimantController from '../../../../main/controllers/multiples/RemoveAdditionalClaimantController';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { CaseState } from '../../../../main/definitions/definition';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handlePostLogic').mockImplementation(() => Promise.resolve());

describe('RemoveAdditionalClaimantController', () => {
  const t = {
    common: {},
    'remove-other-claimant': {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render remove claimant page', () => {
    const response = mockResponse();
    const request = mockRequest({ t, userCase: { state: CaseState.AWAITING_SUBMISSION_TO_HMCTS } });

    new RemoveAdditionalClaimantController().get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.REMOVE_ADDITIONAL_CLAIMANT, expect.anything());
  });

  it('should remove claimant when yes is selected for a valid index', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: { removeAdditionalClaimant: YesOrNo.YES },
    });
    request.query = { additionalClaimant: '1' };
    request.session.userCase.additionalClaimants = [
      { firstName: 'First', lastName: 'Person' },
      { firstName: 'Second', lastName: 'Person' },
    ];

    await new RemoveAdditionalClaimantController().post(request, response);

    expect(request.session.userCase.additionalClaimants).toHaveLength(1);
    expect(request.session.userCase.additionalClaimants[0].firstName).toBe('First');
    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
      request,
      response,
      expect.anything(),
      expect.anything(),
      PageUrls.REVIEW_ADDITIONAL_CLAIMANTS
    );
  });

  it('should not remove claimant when no is selected', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: { removeAdditionalClaimant: YesOrNo.NO },
    });
    request.query = { index: '0' };
    request.session.userCase.additionalClaimants = [{ firstName: 'Only', lastName: 'Person' }];

    await new RemoveAdditionalClaimantController().post(request, response);

    expect(request.session.userCase.additionalClaimants).toHaveLength(1);
  });

  it('should not remove claimant when index is invalid', async () => {
    const response = mockResponse();
    const request = mockRequest({
      body: { removeAdditionalClaimant: YesOrNo.YES },
    });
    request.query = { index: 'not-a-number' };
    request.session.userCase.additionalClaimants = [{ firstName: 'Only', lastName: 'Person' }];

    await new RemoveAdditionalClaimantController().post(request, response);

    expect(request.session.userCase.additionalClaimants).toHaveLength(1);
  });

  it('should redirect via CaseStateCheck when the case state is not awaiting submission', () => {
    const response = mockResponse();
    const request = mockRequest({ userCase: { state: CaseState.SUBMITTED } });

    new RemoveAdditionalClaimantController().get(request, response);

    expect(response.render).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalled();
  });
});
