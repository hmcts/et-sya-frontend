import GroupRepresentativeController from '../../../../main/controllers/multiples/GroupRepresentativeController';
import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';
import { userCaseWithRespondent } from '../../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('GroupRepresentativeController', () => {
  const t = {
    common: {},
    'group-representative': {
      legend: 'Do you agree to be the group claim representative?',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the group representative page', () => {
    const controller = new GroupRepresentativeController();
    const response = mockResponse();
    const translations = {
      ...t.common,
      ...t['group-representative'],
      continue: 'Continue',
    };
    const request = mockRequestWithTranslation({}, translations);
    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.GROUP_REPRESENTATIVE,
      expect.objectContaining({
        legend: 'Do you agree to be the group claim representative?',
      })
    );
  });

  it('should redirect to claim steps when yes is selected', async () => {
    const controller = new GroupRepresentativeController();
    const response = mockResponse();
    const request = mockRequest({
      body: {
        leadClaimant: YesOrNo.YES,
      },
    });
    request.url = PageUrls.GROUP_REPRESENTATIVE;

    await controller.post(request, response);

    expect(request.session.userCase.leadClaimant).toBe(YesOrNo.YES);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.GROUP_CLAIMS_CHECK);
  });

  it('should redirect back to group representative when no option is selected', async () => {
    const controller = new GroupRepresentativeController();
    const response = mockResponse();
    const request = mockRequest({
      body: {},
    });
    request.url = PageUrls.GROUP_REPRESENTATIVE;

    await controller.post(request, response);

    expect(request.session.errors).toEqual([{ propertyName: 'leadClaimant', errorType: 'required' }]);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.GROUP_REPRESENTATIVE);
  });
});
