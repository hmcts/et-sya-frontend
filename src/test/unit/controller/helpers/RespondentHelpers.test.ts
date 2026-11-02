import {
  fillAddressAddressFields,
  fillRepresentativeAddressFields,
  fillRespondentAddressFields,
  fillWorkAddressFields,
  getRespondentIndex,
  getRespondentRedirectUrl,
  getRespondentsWithRemoved,
  mapSelectedRespondentValuesToCase,
  setNumbersToRespondents,
  setUserCaseForRespondent,
} from '../../../../main/controllers/helpers/RespondentHelpers';
import { CaseWithId, Respondent } from '../../../../main/definitions/case';
import { ErrorPages, PageUrls } from '../../../../main/definitions/constants';
import { mockSession } from '../../mocks/mockApp';
import { mockForm, mockFormField, mockValidationCheckWithOutError } from '../../mocks/mockForm';
import { mockRequest } from '../../mocks/mockRequest';
import { userCaseWith4Respondents } from '../../mocks/mockUserCaseWithRespondent';

describe('setUserCaseForRespondent', () => {
  const makeField = (name: string) =>
    mockFormField(name, name, 'text', 'value', mockValidationCheckWithOutError(), name);

  it('should initialise userCase when it is undefined', () => {
    const req = mockRequest({ body: { testFormField: 'value' } });
    req.session.userCase = undefined;
    req.params = { respondentNumber: '1' };
    const form = mockForm({ testFormField: makeField('testFormField') });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase).toBeDefined();
  });

  it('should create first respondent when respondents array is undefined', () => {
    const req = mockRequest({ body: { testFormField: 'value' } });
    req.session.userCase.respondents = undefined;
    req.params = { respondentNumber: '1' };
    const form = mockForm({ testFormField: makeField('testFormField') });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondents).toHaveLength(1);
    expect(req.session.userCase.respondents[0].respondentNumber).toEqual(1);
  });

  it('should clear acasCertNum when acasCert is NO', () => {
    const req = mockRequest({ body: { acasCert: 'No', acasCertNum: 'A123' } });
    req.session.userCase.respondents = [{ respondentNumber: 1 }] as Respondent[];
    req.params = { respondentNumber: '1' };
    const acasCertField = makeField('acasCert');
    const acasCertNumField = makeField('acasCertNum');
    const form = mockForm({ acasCert: acasCertField, acasCertNum: acasCertNumField });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondents[0].acasCertNum).toBeUndefined();
  });

  it('should clear noAcasReason when acasCert is YES', () => {
    const req = mockRequest({ body: { acasCert: 'Yes', noAcasReason: 'Reason' } });
    req.session.userCase.respondents = [{ respondentNumber: 1 }] as Respondent[];
    req.params = { respondentNumber: '1' };
    const acasCertField = makeField('acasCert');
    const noAcasReasonField = makeField('noAcasReason');
    const form = mockForm({ acasCert: acasCertField, noAcasReason: noAcasReasonField });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondents[0].noAcasReason).toBeUndefined();
  });

  it('should set workAddressTypes and workEnterPostcode when present in body', () => {
    const req = mockRequest({ body: { workAddressTypes: '1', workEnterPostcode: 'SW1A 1AA' } });
    req.session.userCase.respondents = [{ respondentNumber: 1 }] as Respondent[];
    req.params = { respondentNumber: '1' };
    const form = mockForm({
      workAddressTypes: makeField('workAddressTypes'),
      workEnterPostcode: makeField('workEnterPostcode'),
    });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.workAddressTypes).toEqual('1');
    expect(req.session.userCase.workEnterPostcode).toEqual('SW1A 1AA');
  });

  it('should set respondentAddressTypes and respondentEnterPostcode when present in body', () => {
    const req = mockRequest({ body: { respondentAddressTypes: '0', respondentEnterPostcode: 'EC1A 1BB' } });
    req.session.userCase.respondents = [{ respondentNumber: 1 }] as Respondent[];
    req.params = { respondentNumber: '1' };
    const form = mockForm({
      respondentAddressTypes: makeField('respondentAddressTypes'),
      respondentEnterPostcode: makeField('respondentEnterPostcode'),
    });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondentAddressTypes).toEqual('0');
    expect(req.session.userCase.respondentEnterPostcode).toEqual('EC1A 1BB');
  });

  it('should add new respondent to request when number of respondents is less than selectedRespondentIndex', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.session.userCase = userCaseWith4Respondents;
    const formField = mockFormField(
      'testFormField',
      'test name',
      'text',
      'test value',
      mockValidationCheckWithOutError(),
      'test label'
    );
    req.params = { respondentNumber: '5' };
    const form = mockForm({ testFormField: formField });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondents).toHaveLength(5);
  });
});

describe('fillWorkAddressFields', () => {
  it('should add address fields to usercase', async () => {
    const addresses = [
      {
        fullAddress: 'Buckingham Palace, London, SW1A 1AA',
        street1: 'Buckingham Palace',
        street2: '',
        town: 'London',
        county: 'City Of Westminster',
        postcode: 'SW1A 1AA',
        country: 'England',
      },
    ];
    const userCase = {} as CaseWithId;
    userCase.workAddresses = addresses;
    const x = 0;
    fillWorkAddressFields(x, userCase);
    expect(userCase.workAddress1).toStrictEqual('Buckingham Palace');
    expect(userCase.workAddress2).toStrictEqual('');
    expect(userCase.workAddressTown).toStrictEqual('London');
    expect(userCase.workAddressCountry).toStrictEqual('England');
    expect(userCase.workAddressPostcode).toStrictEqual('SW1A 1AA');
  });
});

describe('fillAddressAddressFields', () => {
  it('should add address fields to usercase', async () => {
    const addresses = [
      {
        fullAddress: 'Buckingham Palace, London, SW1A 1AA',
        street1: 'Buckingham Palace',
        street2: '',
        town: 'London',
        county: 'City Of Westminster',
        postcode: 'SW1A 1AA',
        country: 'England',
      },
    ];
    const userCase = {} as CaseWithId;
    userCase.addressAddresses = addresses;
    const x = 0;
    fillAddressAddressFields(x, userCase);
    expect(userCase.address1).toStrictEqual('Buckingham Palace');
    expect(userCase.address2).toStrictEqual('');
    expect(userCase.addressTown).toStrictEqual('London');
    expect(userCase.addressCountry).toStrictEqual('England');
    expect(userCase.addressPostcode).toStrictEqual('SW1A 1AA');
  });
});

describe('fillRespondentAddressFields', () => {
  it('should add address fields to usercase', async () => {
    const addresses = [
      {
        fullAddress: 'Buckingham Palace, London, SW1A 1AA',
        street1: 'Buckingham Palace',
        street2: '',
        town: 'London',
        county: 'City Of Westminster',
        postcode: 'SW1A 1AA',
        country: 'England',
      },
    ];
    const userCase = {} as CaseWithId;
    userCase.respondentAddresses = addresses;
    const x = 0;
    fillRespondentAddressFields(x, userCase);
    expect(userCase.respondentAddress1).toStrictEqual('Buckingham Palace');
    expect(userCase.respondentAddress2).toStrictEqual('');
    expect(userCase.respondentAddressTown).toStrictEqual('London');
    expect(userCase.respondentAddressCountry).toStrictEqual('England');
    expect(userCase.respondentAddressPostcode).toStrictEqual('SW1A 1AA');
  });
});

describe('fillRepresentativeAddressFields', () => {
  const addresses = [
    {
      fullAddress: '10 Rep Lane, Bristol, BS1 1AA',
      street1: '10 Rep Lane',
      street2: 'Floor 2',
      town: 'Bristol',
      county: 'Avon',
      postcode: 'BS1 1AA',
      country: 'England',
    },
  ];

  it('should map representative address fields to userCase', () => {
    const userCase = { representativeAddresses: addresses } as unknown as CaseWithId;
    fillRepresentativeAddressFields(0, userCase);
    expect(userCase.repAddress1).toStrictEqual('10 Rep Lane');
    expect(userCase.repAddress2).toStrictEqual('Floor 2');
    expect(userCase.repAddressTown).toStrictEqual('Bristol');
    expect(userCase.repAddressCountry).toStrictEqual('England');
    expect(userCase.repAddressPostcode).toStrictEqual('BS1 1AA');
  });

  it('should not map fields when x is an object', () => {
    const userCase = { representativeAddresses: addresses } as unknown as CaseWithId;
    fillRepresentativeAddressFields({} as unknown, userCase);
    expect(userCase.repAddress1).toBeUndefined();
  });
});

describe('mapSelectedRespondentValuesToCase', () => {
  it('should copy respondent values to userCase top-level fields', () => {
    const userCase = {
      respondents: [
        {
          respondentName: 'Acme Corp',
          respondentAddress1: '1 Corp St',
          respondentAddress2: 'Suite 1',
          respondentAddressTown: 'London',
          respondentAddressCountry: 'England',
          respondentAddressPostcode: 'EC1A 1BB',
          acasCert: 'Yes',
          acasCertNum: 'A123456/20/12345',
          noAcasReason: undefined,
        },
      ],
    } as unknown as CaseWithId;

    mapSelectedRespondentValuesToCase(0, userCase);

    expect(userCase.respondentName).toStrictEqual('Acme Corp');
    expect(userCase.respondentAddress1).toStrictEqual('1 Corp St');
    expect(userCase.acasCert).toStrictEqual('Yes');
    expect(userCase.acasCertNum).toStrictEqual('A123456/20/12345');
  });

  it('should not throw when userCase is undefined', () => {
    expect(() => mapSelectedRespondentValuesToCase(0, undefined)).not.toThrow();
  });

  it('should not throw when respondents is undefined', () => {
    const userCase = {} as CaseWithId;
    expect(() => mapSelectedRespondentValuesToCase(0, userCase)).not.toThrow();
  });
});

describe('getRespondentsWithRemoved', () => {
  it('should remove the respondent at the given index', () => {
    const respondents: Respondent[] = [
      { respondentNumber: 1, respondentName: 'First' },
      { respondentNumber: 2, respondentName: 'Second' },
      { respondentNumber: 3, respondentName: 'Third' },
    ] as Respondent[];

    const result = getRespondentsWithRemoved(respondents, 1);
    expect(result).toHaveLength(2);
    expect(result[0].respondentName).toStrictEqual('First');
    expect(result[1].respondentName).toStrictEqual('Third');
  });
});

describe('setNumbersToRespondents', () => {
  it('should assign sequential respondent numbers starting from 1', () => {
    const respondents: Respondent[] = [{} as Respondent, {} as Respondent, {} as Respondent];
    setNumbersToRespondents(respondents);
    expect(respondents[0].respondentNumber).toBe(1);
    expect(respondents[1].respondentNumber).toBe(2);
    expect(respondents[2].respondentNumber).toBe(3);
  });

  it('should not throw when respondents is empty', () => {
    expect(() => setNumbersToRespondents([])).not.toThrow();
  });

  it('should not throw when respondents is undefined', () => {
    expect(() => setNumbersToRespondents(undefined)).not.toThrow();
  });
});

describe('getRespondentIndex', () => {
  it('should return zero-based index from respondentNumber param', () => {
    const req = mockRequest({});
    req.params = { respondentNumber: '3' };
    expect(getRespondentIndex(req)).toBe(2);
  });

  it('should return 0 for respondentNumber "1"', () => {
    const req = mockRequest({});
    req.params = { respondentNumber: '1' };
    expect(getRespondentIndex(req)).toBe(0);
  });
});

describe('getRespondentRedirectUrl', () => {
  it('should return a valid respondent URL for respondent 1 with respondent-name page', () => {
    const result = getRespondentRedirectUrl(1, PageUrls.RESPONDENT_NAME);
    expect(result).toContain('/respondent/1');
    expect(result).toContain(PageUrls.RESPONDENT_NAME);
  });

  it('should return NOT_FOUND for an invalid combination', () => {
    const result = getRespondentRedirectUrl(99, '/nonexistent-page');
    expect(result).toEqual(ErrorPages.NOT_FOUND);
  });

  it('should return Welsh URL when Welsh language parameter is appended', () => {
    const result = getRespondentRedirectUrl(1, PageUrls.RESPONDENT_NAME + '?lng=cy');
    expect(result).toContain('lng=cy');
  });

  it('should return English URL when English language parameter is appended', () => {
    const result = getRespondentRedirectUrl(1, PageUrls.RESPONDENT_NAME + '?lng=en');
    expect(result).toContain('lng=en');
  });
});
