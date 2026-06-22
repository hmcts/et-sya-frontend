import {
  validateAdditionalClaimants,
  validateGroupClaimsCheckDetails,
} from '../../../main/components/form/group-claims-validator';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { mockRequest } from '../mocks/mockRequest';

describe('group-claims-validator', () => {
  describe('validateAdditionalClaimants', () => {
    it('should return no errors for valid claimants', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toHaveLength(0);
    });

    it('should return nameRequired error when firstName is missing', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'nameRequired' }]));
    });

    it('should return nameRequired error when lastName is missing', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'nameRequired' }]));
    });

    it('should return nameRequired error when firstName is whitespace only', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: '   ',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'nameRequired' }]));
    });

    it('should return addressRequired error when address object is missing', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [{ firstName: 'Jane', lastName: 'Doe' }];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'addressRequired' }])
      );
    });

    it('should return addressRequired error when AddressLine1 is missing', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { PostTown: 'London', Country: 'England' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'addressRequired' }])
      );
    });

    it('should return addressRequired error when PostTown is missing', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', Country: 'England' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'addressRequired' }])
      );
    });

    it('should return addressRequired error when Country is missing', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London' },
        },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(
        expect.arrayContaining([{ propertyName: 'hiddenErrorField', errorType: 'addressRequired' }])
      );
    });

    it('should return both name and address errors for a claimant missing both', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [{}];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toEqual(
        expect.arrayContaining([
          { propertyName: 'hiddenErrorField', errorType: 'nameRequired' },
          { propertyName: 'hiddenErrorField', errorType: 'addressRequired' },
        ])
      );
    });

    it('should return no errors when additionalClaimants is undefined', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = undefined;

      const errors = validateAdditionalClaimants(req);

      expect(errors).toHaveLength(0);
    });

    it('should return no errors for empty array', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toHaveLength(0);
    });

    it('should validate multiple claimants and return errors for each invalid one', () => {
      const req = mockRequest({});
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Valid',
          lastName: 'Claimant',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
        { firstName: 'Missing', lastName: 'Address' },
      ];

      const errors = validateAdditionalClaimants(req);

      expect(errors).toHaveLength(1);
      expect(errors[0].errorType).toBe('addressRequired');
    });
  });

  describe('validateGroupClaimsCheckDetails', () => {
    it('should return false when userCase is undefined', () => {
      expect(validateGroupClaimsCheckDetails(undefined, undefined)).toBe(false);
    });

    it('should return true for SINGLE case type', () => {
      const req = mockRequest({});
      const userCase = { caseType: CaseType.SINGLE };

      expect(validateGroupClaimsCheckDetails(req, userCase)).toBe(true);
    });

    it('should return false when caseType is neither SINGLE nor MULTIPLE', () => {
      const req = mockRequest({});
      const userCase = { caseType: 'Unknown' };

      expect(validateGroupClaimsCheckDetails(req, userCase)).toBe(false);
    });

    it('should return true for MULTIPLE with valid claimants and lead claimant selection', () => {
      const req = mockRequest({});
      req.session.errors = [];
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];
      const userCase = {
        caseType: CaseType.MULTIPLE,
        additionalClaimants: req.session.userCase.additionalClaimants,
        leadClaimant: YesOrNo.YES,
      };

      expect(validateGroupClaimsCheckDetails(req, userCase)).toBe(true);
    });

    it('should return false for MULTIPLE with no additional claimants', () => {
      const req = mockRequest({});
      req.session.errors = [];
      req.session.userCase.additionalClaimants = [];
      const userCase = {
        caseType: CaseType.MULTIPLE,
        leadClaimant: YesOrNo.YES,
      };

      expect(validateGroupClaimsCheckDetails(req, userCase)).toBe(false);
    });

    it('should return false for MULTIPLE with no lead claimant selection', () => {
      const req = mockRequest({});
      req.session.errors = [];
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];
      const userCase = {
        caseType: CaseType.MULTIPLE,
        additionalClaimants: req.session.userCase.additionalClaimants,
      };

      expect(validateGroupClaimsCheckDetails(req, userCase)).toBe(false);
    });

    it('should return false and push errors for MULTIPLE with invalid claimants', () => {
      const req = mockRequest({});
      req.session.errors = [];
      req.session.userCase.additionalClaimants = [{ firstName: 'Jane' }]; // missing lastName and address
      const userCase = {
        caseType: CaseType.MULTIPLE,
        additionalClaimants: req.session.userCase.additionalClaimants,
        leadClaimant: YesOrNo.YES,
      };

      const result = validateGroupClaimsCheckDetails(req, userCase);

      expect(result).toBe(false);
      expect(req.session.errors.length).toBeGreaterThan(0);
    });

    it('should accept leadClaimant NO as valid selection', () => {
      const req = mockRequest({});
      req.session.errors = [];
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];
      const userCase = {
        caseType: CaseType.MULTIPLE,
        additionalClaimants: req.session.userCase.additionalClaimants,
        leadClaimant: YesOrNo.NO,
      };

      expect(validateGroupClaimsCheckDetails(req, userCase)).toBe(true);
    });
  });
});
