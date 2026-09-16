import { getClaimantContactDetails } from '../../../../main/controllers/helpers/ClaimantContactDetailsHelper';
import { CaseWithId } from '../../../../main/definitions/case';

const translations = {
  name: 'Name',
  dateOfBirth: 'Date of birth',
  address: 'Address',
  email: 'Email address',
  notProvided: 'Not provided',
};

describe('getClaimantContactDetails', () => {
  it('should build read-only rows from the represented claimant details', () => {
    const userCase = {
      representedClaimantFirstName: 'Jane',
      representedClaimantLastName: 'Doe',
      representedClaimantDateOfBirth: { day: '01', month: '02', year: '1990' },
      representedClaimantAddress1: '1 High Street',
      representedClaimantAddressTown: 'London',
      representedClaimantAddressPostcode: 'AB1 2CD',
      representedClaimantEmail: 'jane.doe@example.com',
    } as CaseWithId;

    const rows = getClaimantContactDetails(userCase, translations);

    expect(rows.map(r => r.key.text)).toEqual(['Name', 'Date of birth', 'Address', 'Email address']);
    expect(rows[0].value.text).toBe('Jane Doe');
    expect(rows[1].value.text).toBe('01-02-1990');
    expect(rows[2].value.text).toContain('1 High Street');
    expect(rows[2].value.text).toContain('AB1 2CD');
    expect(rows[3].value.text).toBe('jane.doe@example.com');
  });

  it('should show "Not provided" for missing values', () => {
    const rows = getClaimantContactDetails({} as CaseWithId, translations);

    expect(rows[0].value.text).toBe('Not provided');
    expect(rows[1].value.text).toBe('Not provided');
    expect(rows[2].value.text).toBe('Not provided');
    expect(rows[3].value.text).toBe('Not provided');
  });
});
