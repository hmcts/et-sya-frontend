import { getNewApplicationStatus } from '../../../../main/controllers/helpers/ApplicationStateHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import { mockGenericTseCollection } from '../../mocks/mockGenericTseCollection';

describe('Respondent Application status Helper tests', () => {
  const mockApp = mockGenericTseCollection[0];

  it('should change from not viewed yet to viewed', () => {
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.VIEWED);
  });

  it('should change from Updated to in progress', () => {
    mockApp.value.applicationState = HubLinkStatus.UPDATED;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.IN_PROGRESS);
  });

  it('should change respondent app from not started yet to in progress', () => {
    mockApp.value.applicationState = HubLinkStatus.NOT_STARTED_YET;
    mockApp.value.claimantResponseRequired = YesOrNo.NO;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.IN_PROGRESS);
  });

  it('should not change status when claimant response is required', () => {
    mockApp.value.applicationState = HubLinkStatus.NOT_STARTED_YET;
    mockApp.value.claimantResponseRequired = YesOrNo.YES;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toBeUndefined();
  });
});

describe('Claimant Application status Helper tests', () => {
  const mockApp = mockGenericTseCollection[1];

  it('should change from not viewed yet to viewed', () => {
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.VIEWED);
  });

  it('should change from Updated to Waiting for the tribunal', () => {
    mockApp.value.applicationState = HubLinkStatus.UPDATED;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.WAITING_FOR_TRIBUNAL);
  });

  it('should change from Updated to in progress when respondent response required', () => {
    mockApp.value.applicationState = HubLinkStatus.UPDATED;
    mockApp.value.respondentResponseRequired = YesOrNo.YES;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.IN_PROGRESS);
  });

  it('should change from Not started yet to in progress', () => {
    mockApp.value.applicationState = HubLinkStatus.NOT_STARTED_YET;
    mockApp.value.claimantResponseRequired = YesOrNo.NO;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toEqual(HubLinkStatus.IN_PROGRESS);
  });

  it('should not change status when claimant response is required', () => {
    mockApp.value.applicationState = HubLinkStatus.NOT_STARTED_YET;
    mockApp.value.claimantResponseRequired = YesOrNo.YES;
    const result = getNewApplicationStatus(mockApp);
    expect(result).toBeUndefined();
  });
});
