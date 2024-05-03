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
    expect(result).toHaveLength(3);
  });

  it('returns no applications when no responses', () => {
    mockGenericTseCollection[0].value.respondCollection = [];
    mockGenericTseCollection[1].value.respondCollection = [];
    mockGenericTseCollection[2].value.respondCollection = [];
    const result = getApplicationsWithTribunalOrderOrRequest(mockGenericTseCollection, [], 'en');
    expect(result).toHaveLength(0);
  });

  it('does not enter code if empty apps are passed', () => {
    const result = getApplicationsWithTribunalOrderOrRequest([], [], 'en');
    expect(result).toHaveLength(0);
  });
});
