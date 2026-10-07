import GroupClaimRequestsAndApplicationsController from '../../../main/controllers/GroupClaimRequestsAndApplicationsController';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Group Claim Requests And Applications Controller', () => {
  const t = {
    common: {},
  };
  const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockClient.mockResolvedValue(true);

  it('should render the group claim requests and applications page', async () => {
    const controller = new GroupClaimRequestsAndApplicationsController();
    const response = mockResponse();
    const request = mockRequest({ t });
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.GROUP_CLAIM_REQUESTS_AND_APPLICATIONS,
      expect.anything()
    );
  });

  it('should only show applications with copyToOtherParty Yes when isGroupClaim is true', async () => {
    const controller = new GroupClaimRequestsAndApplicationsController();
    const response = mockResponse();
    const request = mockRequest({
      t,
      session: {
        userCase: {
          caseType: CaseType.MULTIPLE,
          genericTseApplicationCollection: [
            { id: '1', value: { copyToOtherPartyYesOrNo: YesOrNo.YES } },
            { id: '2', value: { copyToOtherPartyYesOrNo: YesOrNo.NO } },
          ],
        },
      },
    });

    await controller.get(request, response);
    const renderCall = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderCall.tseGenericApps).toHaveLength(1);
    expect(renderCall.tseGenericApps[0].id).toBe('1');
  });
});
