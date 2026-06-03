import { getGroupClaimDetails } from '../../../../main/controllers/helpers/GroupClaimDetailsAnswersHelper';
import { AddAdditionalClaimant, CaseType, CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../../main/definitions/constants';

const translations = {
  change: 'Change',
  yes: 'Yes',
  no: 'No',
  notProvided: 'Not provided',
  groupClaimDetails: {
    claimType: 'Claim type',
    single: 'Single',
    multiple: 'Multiple',
    addAdditionalClaimantsMethod: 'How claimants were added',
    manually: 'Manually',
    spreadsheet: 'Spreadsheet',
    additionalClaimants: 'Additional claimants',
    additionalClaimant: 'Additional claimant',
    groupRepresentative: 'Group representative',
    nameLabel: 'Name',
    emailLabel: 'Email',
    dobLabel: 'Date of birth',
    addressLabel: 'Address',
  },
};

describe('GroupClaimDetailsAnswersHelper', () => {
  describe('getGroupClaimDetails', () => {
    it('should return a single row for SINGLE case type', () => {
      const userCase = { caseType: CaseType.SINGLE } as CaseWithId;
      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows).toHaveLength(1);
      expect(rows[0].value.text).toBe('Single');
      expect(rows[0].actions.items[0].href).toContain(PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
    });

    it('should return rows for MULTIPLE case type including additional claimants and lead claimant', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [
          {
            title: 'Mr',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            dob: { day: '01', month: '01', year: '1990' },
            address: {
              AddressLine1: '1 Main St',
              PostTown: 'London',
              Country: 'England',
            },
          },
        ],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows).toHaveLength(4);
      // Claim type
      expect(rows[0].value.text).toBe('Multiple');
      // Add claimant method
      expect(rows[1].value.text).toBe('Manually');
      expect(rows[1].actions.items[0].href).toContain(PageUrls.ADD_ANOTHER_CLAIMANT);
      // Additional claimants HTML
      expect(rows[2].value.html).toContain('John');
      expect(rows[2].value.html).toContain('john@example.com');
      expect(rows[2].actions.items[0].href).toContain(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS);
      // Group representative
      expect(rows[3].value.text).toBe('Yes');
      expect(rows[3].actions.items[0].href).toContain(PageUrls.GROUP_REPRESENTATIVE);
    });

    it('should show "Not provided" for default/unknown case type', () => {
      const userCase = {} as CaseWithId;
      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows).toHaveLength(1);
      expect(rows[0].value.text).toBe('Not provided');
    });

    it('should show "Not provided" when addClaimantMethod is undefined for MULTIPLE', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        leadClaimant: YesOrNo.NO,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows[1].value.text).toBe('Not provided');
    });

    it('should show Spreadsheet for addClaimantMethod SPREADSHEET', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.SPREADSHEET,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows[1].value.text).toBe('Spreadsheet');
    });

    it('should show "No" for leadClaimant NO', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.NO,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows[3].value.text).toBe('No');
    });

    it('should show "Not provided" when leadClaimant is undefined', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows[3].value.text).toBe('Not provided');
    });

    it('should show "Not provided" when there are no additional claimants', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.YES,
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      // When additionalClaimants is undefined/empty, buildAdditionalClaimantCards returns notProvided
      expect(rows[2].value.html).toBe('Not provided');
    });

    it('should build cards for multiple additional claimants', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [
          { firstName: 'Alice', lastName: 'Smith' },
          { firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com' },
        ],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      expect(rows[2].value.html).toContain('Additional claimant  1');
      expect(rows[2].value.html).toContain('Additional claimant  2');
      expect(rows[2].value.html).toContain('Alice');
      expect(rows[2].value.html).toContain('bob@test.com');
    });

    it('should include ANSWERS_CHANGE intercept path in all change links', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const rows = getGroupClaimDetails(userCase, translations);

      for (const row of rows) {
        expect(row.actions.items[0].href).toContain(InterceptPaths.ANSWERS_CHANGE);
      }
    });
  });
});
