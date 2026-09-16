import YourAppsToTheTribunalController from '../../../main/controllers/YourAppsToTheTribunalController';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Apps To The Tribunal Controller', () => {
  const t = {
    common: {},
  };
  const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockClient.mockResolvedValue(true);

  it('should render the applications page', async () => {
    const controller = new YourAppsToTheTribunalController();
    const response = mockResponse();
    const request = mockRequest({ t });
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('your-applications', expect.anything());
  });

  it('should filter out applications with copyToOtherParty Yes when isGroupClaim is true', async () => {
    const controller = new YourAppsToTheTribunalController();
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
    expect(response.render).toHaveBeenCalledWith(
      'your-applications',
      expect.objectContaining({
        tseGenericApps: expect.arrayContaining([expect.objectContaining({ id: '2' })]),
      })
    );
    const renderCall = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderCall.tseGenericApps).toHaveLength(1);
    expect(renderCall.tseGenericApps[0].id).toBe('2');
  });

  it('should show all applications when isGroupClaim is false', async () => {
    const controller = new YourAppsToTheTribunalController();
    const response = mockResponse();
    const request = mockRequest({
      t,
      session: {
        userCase: {
          caseType: CaseType.SINGLE,
          genericTseApplicationCollection: [
            { id: '1', value: { copyToOtherPartyYesOrNo: YesOrNo.YES } },
            { id: '2', value: { copyToOtherPartyYesOrNo: YesOrNo.NO } },
          ],
        },
      },
    });

    await controller.get(request, response);
    const renderCall = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderCall.tseGenericApps).toHaveLength(2);
  });
});
