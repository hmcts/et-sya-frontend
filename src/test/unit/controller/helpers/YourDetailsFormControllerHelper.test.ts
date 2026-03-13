import YourDetailsFormControllerHelper from '../../../../main/controllers/helpers/YourDetailsFormControllerHelper';
import { CaseWithId } from '../../../../main/definitions/case';
import { DefaultValues } from '../../../../main/definitions/constants';

describe('YourDetailsFormControllerHelper', () => {
  describe('generateBasicUserCaseByYourDetailsFormData', () => {
    it('should generate a basic user case with correct id and claimant name', () => {
      const formData: Partial<CaseWithId> = {
        id: '1234567890123456',
        claimantName: 'John Doe',
      };

      const result = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);

      expect(result.id).toBe('1234567890123456');
      expect(result.claimantName).toBe('John Doe');
    });

    it('should split claimant name into first name and last name', () => {
      const formData: Partial<CaseWithId> = {
        id: '1234567890123456',
        claimantName: 'John Doe',
      };

      const result = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);

      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should handle single word claimant name', () => {
      const formData: Partial<CaseWithId> = {
        id: '1234567890123456',
        claimantName: 'John',
      };

      const result = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);

      expect(result.firstName).toBe('John');
      expect(result.lastName).toBeUndefined();
    });

    it('should set default values for createdDate, lastModified, and state', () => {
      const formData: Partial<CaseWithId> = {
        id: '1234567890123456',
        claimantName: 'John Doe',
      };

      const result = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);

      expect(result.createdDate).toBe(DefaultValues.STRING_EMPTY);
      expect(result.lastModified).toBe(DefaultValues.STRING_EMPTY);
      expect(result.state).toBeUndefined();
    });

    it('should set respondentName to empty string', () => {
      const formData: Partial<CaseWithId> = {
        id: '1234567890123456',
        claimantName: 'John Doe',
      };

      const result = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);

      expect(result.respondentName).toBe(DefaultValues.STRING_EMPTY);
    });

    it('should handle name with multiple spaces', () => {
      const formData: Partial<CaseWithId> = {
        id: '1234567890123456',
        claimantName: 'John Michael Doe',
      };

      const result = YourDetailsFormControllerHelper.generateBasicUserCaseByYourDetailsFormData(formData);

      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Michael');
    });
  });
});
