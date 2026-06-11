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
    spreadsheet: 'Spreadsheet upload',
    additionalClaimants: 'Additional claimants',
    additionalClaimant: 'Additional claimant',
    groupRepresentative: 'Group representative',
    nameLabel: 'Name',
    emailLabel: 'Email',
    dobLabel: 'Date of birth',
    addressLabel: 'Address',
    removeClaimant: 'Remove claimant',
    additionalClaimantDocument: 'Additional claimant document',
  },
};

describe('GroupClaimDetailsAnswersHelper', () => {
  describe('getGroupClaimDetails', () => {
    it('should return a single meta row for SINGLE case type with no cards and no post rows', () => {
      const userCase = { caseType: CaseType.SINGLE } as CaseWithId;
      const { metaRows, cardsHtml, postRows } = getGroupClaimDetails(userCase, translations);

      expect(metaRows).toHaveLength(1);
      expect(metaRows[0].value.text).toBe('Single');
      expect(metaRows[0].actions.items[0].href).toContain(PageUrls.SINGLE_OR_MULTIPLE_CLAIM);
      expect(cardsHtml).toBe('');
      expect(postRows).toHaveLength(0);
    });

    it('should return metaRows, cardsHtml, and postRows for MULTIPLE case type', () => {
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

      const { metaRows, cardsHtml, postRows } = getGroupClaimDetails(userCase, translations);

      // Meta rows: claim type + add claimant method
      expect(metaRows).toHaveLength(2);
      expect(metaRows[0].value.text).toBe('Multiple');
      expect(metaRows[1].value.text).toBe('Manually');
      expect(metaRows[1].actions.items[0].href).toContain(PageUrls.ADD_ANOTHER_CLAIMANT);
      // Cards HTML contains claimant data and links
      expect(cardsHtml).toContain('John');
      expect(cardsHtml).toContain('john@example.com');
      expect(cardsHtml).toContain(PageUrls.REMOVE_ADDITIONAL_CLAIMANT);
      expect(cardsHtml).toContain(PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS);
      expect(cardsHtml).toContain(InterceptPaths.ANSWERS_CHANGE);
      // Post rows: group representative
      expect(postRows).toHaveLength(1);
      expect(postRows[0].value.text).toBe('Yes');
      expect(postRows[0].actions.items[0].href).toContain(PageUrls.GROUP_REPRESENTATIVE);
    });

    it('should show "Not provided" for default/unknown case type', () => {
      const userCase = {} as CaseWithId;
      const { metaRows, cardsHtml, postRows } = getGroupClaimDetails(userCase, translations);

      expect(metaRows).toHaveLength(1);
      expect(metaRows[0].value.text).toBe('Not provided');
      expect(cardsHtml).toBe('');
      expect(postRows).toHaveLength(0);
    });

    it('should show "Not provided" when addClaimantMethod is undefined for MULTIPLE', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        leadClaimant: YesOrNo.NO,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { metaRows } = getGroupClaimDetails(userCase, translations);

      expect(metaRows[1].value.text).toBe('Not provided');
    });

    it('should show Spreadsheet for addClaimantMethod SPREADSHEET', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.SPREADSHEET,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { metaRows } = getGroupClaimDetails(userCase, translations);
      expect(metaRows[1].value.text).toBe('Spreadsheet upload');
    });

    it('should show document row when type is SPREADSHEET', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.SPREADSHEET,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { metaRows } = getGroupClaimDetails(userCase, translations);
      expect(metaRows[2].value.text).toBe('Additional claimant document');
    });

    it('should show Yes for leadClaimant when addClaimantMethod is SPREADSHEET', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.SPREADSHEET,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { metaRows } = getGroupClaimDetails(userCase, translations);
      expect(metaRows[3].value.text).toBe('Yes');
    });

    it('should show "No" for leadClaimant NO', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.NO,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { postRows } = getGroupClaimDetails(userCase, translations);

      expect(postRows[0].value.text).toBe('No');
    });

    it('should show "Not provided" when leadClaimant is undefined', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { postRows } = getGroupClaimDetails(userCase, translations);

      expect(postRows[0].value.text).toBe('Not provided');
    });

    it('should show "Not provided" when there are no additional claimants', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.YES,
      } as unknown as CaseWithId;

      const { cardsHtml } = getGroupClaimDetails(userCase, translations);

      expect(cardsHtml).toBe('Not provided');
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

      const { cardsHtml } = getGroupClaimDetails(userCase, translations);

      expect(cardsHtml).toContain('Additional claimant 1');
      expect(cardsHtml).toContain('Additional claimant 2');
      expect(cardsHtml).toContain('Alice');
      expect(cardsHtml).toContain('bob@test.com');
      expect(cardsHtml).toContain(PageUrls.REMOVE_ADDITIONAL_CLAIMANT);
      expect(cardsHtml).toContain(PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS);
      expect(cardsHtml).toContain(InterceptPaths.ANSWERS_CHANGE);
    });

    it('should include ANSWERS_CHANGE intercept path in all summary list rows', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        addClaimantMethod: AddAdditionalClaimant.MANUAL,
        leadClaimant: YesOrNo.YES,
        additionalClaimants: [],
      } as unknown as CaseWithId;

      const { metaRows, postRows } = getGroupClaimDetails(userCase, translations);

      const allRows = [...metaRows, ...postRows];
      expect(allRows.length).toBeGreaterThan(0);
      for (const row of allRows) {
        expect(row.actions.items[0].href).toContain(InterceptPaths.ANSWERS_CHANGE);
      }
    });
  });
});
