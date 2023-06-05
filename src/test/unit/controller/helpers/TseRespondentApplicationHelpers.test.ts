import {
  getRespondentBannerContent,
  populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors,
} from '../../../../main/controllers/helpers/TseRespondentApplicationHelpers';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import applicationDetails from '../../../../main/resources/locales/en/translation/application-details.json';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import common from '../../../../main/resources/locales/en/translation/common.json';
import {
  mockRespAppWithClaimantResponse,
  mockRespAppWithDecisionNotViewed,
  mockRespAppWithDecisionViewed,
  mockSimpleRespAppTypeItem,
} from '../../mocks/mockApplications';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { clone } from '../../test-helpers/clone';

describe('Respondent application details', () => {
  it('should get correct banner content', () => {
    const application = {
      id: '124',
      value: {
        number: '1',
        applicationState: 'notStartedYet',
        applicant: Applicant.CLAIMANT,
        copyToOtherPartyYesOrNo: 'Yes',
        type: 'amend',
        status: 'Open',
        dueDate: '2023-05-07',
        date: '2023-05-01',
      },
    } as GenericTseApplicationTypeItem;

    const translationJson = { ...common, ...citizenHubRaw, ...applicationDetails };

    const result = getRespondentBannerContent([application], translationJson, '?lng=en');

    expect(result).toEqual([
      {
        applicant: Applicant.CLAIMANT,
        applicationType: 'B',
        copyToOtherPartyYesOrNo: 'Yes',
        respondByDate: 'Sunday 7 May 2023',
        date: '2023-05-01',
        number: '124',
        respondToRespondentAppRedirectUrl: '/respondent-application-details/124?lng=en',
        respondentApplicationHeader: 'The respondent has applied to amend my claim',
        applicationState: 'notStartedYet',
        type: 'amend',
      },
    ]);
  });

  describe('respondent application list', () => {
    const url = 'testUrl';
    const req = mockRequestWithTranslation({}, { ...citizenHubRaw });
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    it('correct redirect name and url', () => {
      const item = clone(mockSimpleRespAppTypeItem);
      const items = [item];

      populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(items, url, translations);

      expect(item.value.type).toEqual('Amend response');
      expect(item.redirectUrl).toEqual('/respondent-application-details/1?lng=en');
    });

    it('correct status when no replies', () => {
      const item = clone(mockSimpleRespAppTypeItem);
      const items = [item];

      populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(items, url, translations);

      expect(item.statusColor).toEqual('--red');
      expect(item.displayStatus).toEqual('Not started yet');
    });

    it('correct status when claimant replies', () => {
      const item = {
        id: '1',
        value: clone(mockRespAppWithClaimantResponse),
      } as GenericTseApplicationTypeItem;
      const items = [item];

      populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(items, url, translations);

      expect(item.statusColor).toEqual('--grey');
      expect(item.displayStatus).toEqual('Waiting for the tribunal');
    });

    it("correct status when tribunal records a decision and claimant didn't view", () => {
      const item = {
        id: '1',
        value: clone(mockRespAppWithDecisionNotViewed),
      } as GenericTseApplicationTypeItem;
      const items = [item];

      populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(items, url, translations);

      expect(item.statusColor).toEqual('--red');
      expect(item.displayStatus).toEqual('Not viewed yet');
    });

    it('correct status when tribunal records a decision and claimant viewed', () => {
      const item = {
        id: '1',
        value: clone(mockRespAppWithDecisionViewed),
      } as GenericTseApplicationTypeItem;
      const items = [item];

      populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(items, url, translations);

      expect(item.statusColor).toEqual('--turquoise');
      expect(item.displayStatus).toEqual('Viewed');
    });
  });
});
