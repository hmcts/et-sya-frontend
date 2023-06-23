import { getApplicationsWithTribunalOrderOrRequest } from '../../../../main/controllers/helpers/AdminNotificationHelper';
import { mockGenericTseCollection } from '../../mocks/mockGenericTseCollection';

describe('Admin Notification tests', () => {
  it('returns applications with tribunal order or request', () => {
    const result = getApplicationsWithTribunalOrderOrRequest(mockGenericTseCollection, [], 'en');
    expect(result).toHaveLength(2);
  });
});
