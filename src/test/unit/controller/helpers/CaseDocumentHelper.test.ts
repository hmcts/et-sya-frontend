import { setRespondentResponseHubLinkStatus } from '../../../../main/controllers/helpers/CaseDocumentHelper';
import * as CaseHelpers from '../../../../main/controllers/helpers/CaseHelpers';
import { CaseWithId } from '../../../../main/definitions/case';
import { DocumentDetail } from '../../../../main/definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../../../main/definitions/hub';
import { getLogger } from '../../../../main/logger';
import { mockRequest } from '../../mocks/mockRequest';

describe('setRespondentResponseHubLinkStatus', () => {
  const userCase: Partial<CaseWithId> = {
    hubLinksStatuses: new HubLinksStatuses(),
  };

  const request = mockRequest({ userCase });
  const logger = getLogger('test');
  const mockHandleUpdateHubLinksStatuses = jest.spyOn(CaseHelpers, 'handleUpdateHubLinksStatuses');

  it('should not set Respondent Response hub link status as VIEWED', () => {
    const docDetails: DocumentDetail = {
      id: '1',
      description: 'description',
      type: 'not ET3',
    };

    setRespondentResponseHubLinkStatus(docDetails, request, logger);

    expect(userCase.hubLinksStatuses[HubLinkNames.RespondentResponse]).not.toEqual(HubLinkStatus.VIEWED);
    expect(mockHandleUpdateHubLinksStatuses).not.toHaveBeenCalled();
  });

  it('should set Respondent Response hub link status as VIEWED', () => {
    const docDetails: DocumentDetail = {
      id: '1',
      description: 'description',
      type: 'ET3',
    };

    setRespondentResponseHubLinkStatus(docDetails, request, logger);

    expect(userCase.hubLinksStatuses[HubLinkNames.RespondentResponse]).toEqual(HubLinkStatus.VIEWED);
    expect(mockHandleUpdateHubLinksStatuses).toHaveBeenCalled();
  });
});
