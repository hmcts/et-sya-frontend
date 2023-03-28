import {
  answersAddressFormatter,
  getApplicationRespondByDate,
  getUploadedFileName,
  populateAppItemsWithRedirectLinksCaptionsAndStatusColors,
} from '../../../../main/controllers/helpers/PageContentHelpers';
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

describe('returnFormattedAddress', () => {
  it('should return full formatted address', () => {
    const line1 = '4 main st';
    const line2 = 'woodpark';
    const line3 = 'London';
    const line4 = 'England';
    const line5 = 'SW1A 1AA';

    const address = answersAddressFormatter(line1, line2, line3, line4, line5);

    expect(address).toEqual('4 main st, woodpark, London, England, SW1A 1AA');
  });

  it('should return formatted address without postcode', () => {
    const line1 = '4 main st';
    const line2 = 'woodpark';
    const line3 = 'London';
    const line4 = 'England';

    const address = answersAddressFormatter(line1, line2, line3, line4);

    expect(address).toEqual('4 main st, woodpark, London, England');
  });
  it('should return formatted address without line2', () => {
    const line1 = '4 main st';
    const line3 = 'London';
    const line4 = 'England';

    const address = answersAddressFormatter(line1, line3, line4);

    expect(address).toEqual('4 main st, London, England');
  });

  it('should return file name if present', () => {
    const fileName = 'testfilename';
    expect(getUploadedFileName(fileName)).toEqual('testfilename');
  });

  it('should return empty string if file name is not present', () => {
    expect(getUploadedFileName()).toEqual('');
  });

  it('should populate app items with redirect link, caption, statusColor and displayStatus', () => {
    const genericTseApplicationType = {
      number: '1',
      applicationState: 'inProgress',
      applicant: CLAIMANT,
      type: 'withdraw',
    } as GenericTseApplicationType;

    const item = {
      value: genericTseApplicationType,
    } as GenericTseApplicationTypeItem;
    const items = [item];

    const translationJsons = { ...contactTheTribunalRaw, ...citizenHubRaw, applicationDetails };

    const req = mockRequestWithTranslation({}, translationJsons);
    req.session.userCase.genericTseApplicationCollection = items;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    populateAppItemsWithRedirectLinksCaptionsAndStatusColors(items, 'testUrl', translations);

    expect(item.linkValue).toEqual('Withdraw my claim');
    expect(item.redirectUrl).toEqual('/application-details/1?lng=en');
    expect(item.statusColor).toEqual('--yellow');
    expect(item.displayStatus).toEqual('In progress');
  });
});

it('should get Application due date in correct format', () => {
  const application = {
    id: '124',
    value: {
      number: '1',
      applicationState: 'inProgress',
      applicant: CLAIMANT,
      type: 'withdraw',
      dueDate: '2023-05-05',
    },
  } as GenericTseApplicationTypeItem;

  const translationJson = { ...common };

  const result = getApplicationRespondByDate(application, translationJson);

  expect(result).toEqual('Friday 5 May 2023');
});
