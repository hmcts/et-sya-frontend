import {
  getRespondentBannerContent,
  populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors,
} from '../../../../main/controllers/helpers/TseRespondentApplicationHelpers';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { CLAIMANT, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import applicationDetails from '../../../../main/resources/locales/en/translation/application-details.json';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import common from '../../../../main/resources/locales/en/translation/common.json';
import contactTheTribunalRaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('should get respondent application details', () => {
  it('should get Respondent Application Details', () => {
    const application = {
      id: '124',
      value: {
        number: '1',
        applicationState: 'notStartedYet',
        applicant: CLAIMANT,
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
        applicant: CLAIMANT,
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

  it('should populate respondent app items with redirect link, caption, statusColor and displayStatus', () => {
    const translationJsons = { ...contactTheTribunalRaw, ...citizenHubRaw };

    const req = mockRequestWithTranslation({}, translationJsons);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };
    const respondentApp = {
      number: '1',
      type: 'Amend response',
      applicant: 'Respondent',
      copyToOtherPartyYesOrNo: 'Yes',
      applicationState: 'notStartedYet',
      dueDate: '14 March 2023',
    } as GenericTseApplicationType;

    const item = {
      id: '1',
      value: respondentApp,
    } as GenericTseApplicationTypeItem;
    const items = [item];

    const url = 'testUrl';

    populateRespondentItemsWithRedirectLinksCaptionsAndStatusColors(items, url, translations);

    expect(item.value.type).toEqual('Amend response');
    expect(item.redirectUrl).toEqual('/respondent-application-details/1?lng=en');
    expect(item.statusColor).toEqual('--red');
    expect(item.value.applicationState).toEqual('notStartedYet');
  });
});
