import {
  validateAdditionalClaimants,
  validateGroupClaimsCheckDetails,
} from '../../../main/components/form/group-claims-validator';
import { CaseType, YesOrNo } from '../../../main/definitions/case';

describe('group-claims-validator', () => {
  describe('validateAdditionalClaimants', () => {
    it('should return true for valid claimants', () => {
      const result = validateAdditionalClaimants([
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ]);
      expect(result).toBe(true);
    });

    it('should return false when firstName is missing', () => {
      expect(
        validateAdditionalClaimants([
          {
            lastName: 'Doe',
            address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
          },
        ])
      ).toBe(false);
    });

    it('should return false when lastName is missing', () => {
      expect(
        validateAdditionalClaimants([
          {
            firstName: 'Jane',
            address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
          },
        ])
      ).toBe(false);
    });

    it('should return false when firstName is whitespace only', () => {
      expect(
        validateAdditionalClaimants([
          {
            firstName: '   ',
            lastName: 'Doe',
            address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
          },
        ])
      ).toBe(false);
    });

    it('should return false when address object is missing', () => {
      expect(validateAdditionalClaimants([{ firstName: 'Jane', lastName: 'Doe' }])).toBe(false);
    });

    it('should return false when AddressLine1 is missing', () => {
      expect(
        validateAdditionalClaimants([
          {
            firstName: 'Jane',
            lastName: 'Doe',
            address: { PostTown: 'London', Country: 'England' },
          },
        ])
      ).toBe(false);
    });

    it('should return false when PostTown is missing', () => {
      expect(
        validateAdditionalClaimants([
          {
            firstName: 'Jane',
            lastName: 'Doe',
            address: { AddressLine1: '1 Main St', Country: 'England' },
          },
        ])
      ).toBe(false);
    });

    it('should return false when Country is missing', () => {
      expect(
        validateAdditionalClaimants([
          {
            firstName: 'Jane',
            lastName: 'Doe',
            address: { AddressLine1: '1 Main St', PostTown: 'London' },
          },
        ])
      ).toBe(false);
    });

    it('should return false when a claimant is missing both name and address', () => {
      expect(validateAdditionalClaimants([{}])).toBe(false);
    });

    it('should return true when additionalClaimants is empty array', () => {
      expect(validateAdditionalClaimants([])).toBe(true);
    });

    it('should return false when any one of multiple claimants is invalid', () => {
      expect(
        validateAdditionalClaimants([
          {
            firstName: 'Valid',
            lastName: 'Claimant',
            address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
          },
          { firstName: 'Missing', lastName: 'Address' },
        ])
      ).toBe(false);
    });
  });

  describe('validateGroupClaimsCheckDetails', () => {
    it('should return false when userCase is undefined', () => {
      expect(validateGroupClaimsCheckDetails(undefined, undefined)).toBe(false);
    });

    it('should return true for SINGLE case type', () => {
      expect(validateGroupClaimsCheckDetails(undefined, { caseType: CaseType.SINGLE })).toBe(true);
    });

    it('should return false when caseType is neither SINGLE nor MULTIPLE', () => {
      expect(validateGroupClaimsCheckDetails(undefined, { caseType: 'Unknown' })).toBe(false);
    });

    it('should return true for MULTIPLE with valid claimants and lead claimant selection', () => {
      const userCase = {
        caseType: CaseType.MULTIPLE,
        additionalClaimants: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
          },
        ],
        leadClaimant: YesOrNo.YES,
      };
      expect(validateGroupClaimsCheckDetails(undefined, userCase)).toBe(true);
    });

    it('should return false for MULTIPLE with no additional claimants', () => {
      expect(
        validateGroupClaimsCheckDetails(undefined, {
          caseType: CaseType.MULTIPLE,
          additionalClaimants: [],
          leadClaimant: YesOrNo.YES,
        })
      ).toBe(false);
    });

    it('should return false for MULTIPLE with no lead claimant selection', () => {
      expect(
        validateGroupClaimsCheckDetails(undefined, {
          caseType: CaseType.MULTIPLE,
          additionalClaimants: [
            {
              firstName: 'Jane',
              lastName: 'Doe',
              address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
            },
          ],
        })
      ).toBe(false);
    });

    it('should return false for MULTIPLE with invalid claimants', () => {
      expect(
        validateGroupClaimsCheckDetails(undefined, {
          caseType: CaseType.MULTIPLE,
          additionalClaimants: [{ firstName: 'Jane' }],
          leadClaimant: YesOrNo.YES,
        })
      ).toBe(false);
    });

    it('should return true when leadClaimant is NO', () => {
      expect(
        validateGroupClaimsCheckDetails(undefined, {
          caseType: CaseType.MULTIPLE,
          additionalClaimants: [
            {
              firstName: 'Jane',
              lastName: 'Doe',
              address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
            },
          ],
          leadClaimant: YesOrNo.NO,
        })
      ).toBe(true);
    });

    it('should return true for MULTIPLE with a valid spreadsheet and lead claimant selection', () => {
      expect(
        validateGroupClaimsCheckDetails(undefined, {
          caseType: CaseType.MULTIPLE,
          additionalClaimantSpreadsheet: { document_size: 1024 },
          leadClaimant: YesOrNo.YES,
        })
      ).toBe(true);
    });
  });
});
