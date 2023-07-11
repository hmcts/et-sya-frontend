import { getApplicationsWithTribunalOrderOrRequest } from '../../../../main/controllers/helpers/AdminNotificationHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { mockGenericTseCollection } from '../../mocks/mockGenericTseCollection';

describe('Admin Notification tests', () => {
  it('returns applications with tribunal order or request', () => {
    const result = getApplicationsWithTribunalOrderOrRequest(mockGenericTseCollection, [], 'en');
    expect(result).toHaveLength(3);
  });

  it('returns applications with tribunal order or request with claimant response is no', () => {
    mockGenericTseCollection[1].value.claimantResponseRequired = YesOrNo.NO;
    const result = getApplicationsWithTribunalOrderOrRequest(mockGenericTseCollection, [], 'en');
    expect(result).toHaveLength(2);
  });
});
