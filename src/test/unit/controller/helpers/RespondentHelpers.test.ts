import {
  fillAddressAddressFields,
  fillRespondentAddressFields,
  fillWorkAddressFields,
  setUserCaseForRespondent,
} from '../../../../main/controllers/helpers/RespondentHelpers';
import { CaseWithId } from '../../../../main/definitions/case';
import { mockSession } from '../../mocks/mockApp';
import { mockForm, mockFormField, mockValidationCheckWithOutError } from '../../mocks/mockForm';
import { mockRequest } from '../../mocks/mockRequest';
import { userCaseWith4Respondents } from '../../mocks/mockUserCaseWithRespondent';

describe('setUserCaseForRespondent', () => {
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
  userCase.respondentAddresses = addresses;
  userCase.addressAddresses = addresses;
  const x = 0;
  fillWorkAddressFields(x, userCase);
  fillAddressAddressFields(x, userCase);
  fillRespondentAddressFields(x, userCase);
  expect(userCase.workAddress1).toStrictEqual('Buckingham Palace');
  expect(userCase.workAddress2).toStrictEqual('');
  expect(userCase.workAddressTown).toStrictEqual('London');
  expect(userCase.workAddressCountry).toStrictEqual('England');
  expect(userCase.workAddressPostcode).toStrictEqual('SW1A 1AA');
  expect(userCase.address1).toStrictEqual('Buckingham Palace');
  expect(userCase.address2).toStrictEqual('');
  expect(userCase.addressTown).toStrictEqual('London');
  expect(userCase.addressCountry).toStrictEqual('England');
  expect(userCase.addressPostcode).toStrictEqual('SW1A 1AA');
  expect(userCase.respondentAddress1).toStrictEqual('Buckingham Palace');
  expect(userCase.respondentAddress2).toStrictEqual('');
  expect(userCase.respondentAddressTown).toStrictEqual('London');
  expect(userCase.respondentAddressCountry).toStrictEqual('England');
  expect(userCase.respondentAddressPostcode).toStrictEqual('SW1A 1AA');
});
