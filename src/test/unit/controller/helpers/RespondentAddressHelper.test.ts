import { fillRespondentAddressFieldsNonUK } from '../../../../main/controllers/helpers/RespondentAddressHelper';
import mockUserCase from '../../mocks/mockUserCase';

describe('fillRespondentAddressFieldsNonUK', () => {
  it('should copy respondent address fields into userCase and clear postcode entry and address types', () => {
    const userCase = mockUserCase;
    userCase.respondentEnterPostcode = 'Test';
    userCase.respondentAddressTypes = [
      {
        selected: true,
        label: '1 address found',
      },
      {
        value: 0,
        label: '123 Test St',
      },
    ];
    userCase.respondentAddress1 = '456 Example Road';
    userCase.respondentAddress2 = 'Suite 12';
    userCase.respondentAddressTown = 'Sample City';
    userCase.respondentAddressCountry = 'Example';
    userCase.respondentAddressPostcode = 'EX4 8MP';
    const respondent = {
      respondentAddress1: '123 Test Street',
      respondentAddress2: 'Apt 4B',
      respondentAddressTown: 'Test Town',
      respondentAddressCountry: 'Test Country',
      respondentAddressPostcode: 'TE5 7ST',
    };
    fillRespondentAddressFieldsNonUK(userCase, respondent);

    expect(userCase.respondentEnterPostcode).toBeUndefined();
    expect(userCase.respondentAddressTypes).toBeUndefined();
    expect(userCase.respondentAddress1).toBe('123 Test Street');
    expect(userCase.respondentAddress2).toBe('Apt 4B');
    expect(userCase.respondentAddressTown).toBe('Test Town');
    expect(userCase.respondentAddressCountry).toBe('Test Country');
    expect(userCase.respondentAddressPostcode).toBe('TE5 7ST');
  });
});
