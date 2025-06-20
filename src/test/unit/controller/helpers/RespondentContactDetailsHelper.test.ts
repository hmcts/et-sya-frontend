import {
  getRespondentContactDetails,
  shouldShowViewRespondentContactDetails,
} from '../../../../main/controllers/helpers/RespondentContactDetailsHelper';
import { CaseWithId } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';
import respondentContactDetailsJson from '../../../../main/resources/locales/en/translation/respondent-contact-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respondent Contact Details Helper', () => {
  describe('shouldShowViewRespondentContactDetails', () => {
    it('should return true if respondent response received', () => {
      const userCase = {
        respondents: [
          {
            responseReceived: 'Yes',
          },
        ],
      } as CaseWithId;
      const result = shouldShowViewRespondentContactDetails(userCase);
      expect(result).toEqual(true);
    });

    it('should return true if representative is assigned', () => {
      const userCase: CaseWithId = {
        respondents: [
          {
            ccdId: '1',
          },
        ],
        representatives: [
          {
            respondentId: '1',
          },
        ],
      } as CaseWithId;
      const result = shouldShowViewRespondentContactDetails(userCase);
      expect(result).toEqual(true);
    });

    it('should return false if ET3 is not received', () => {
      const userCase: CaseWithId = {
        respondents: [
          {
            responseReceived: 'No',
          },
        ],
      } as CaseWithId;
      const result = shouldShowViewRespondentContactDetails(userCase);
      expect(result).toEqual(false);
    });

    it('should return false if respondents is undefined', () => {
      const userCase: CaseWithId = {
        respondents: undefined,
      } as CaseWithId;
      const result = shouldShowViewRespondentContactDetails(userCase);
      expect(result).toEqual(false);
    });
  });

  describe('getRespondentContactDetails', () => {
    const translations: AnyRecord = {
      ...respondentContactDetailsJson,
    };

    it('should return respondent details if no representative is assigned', () => {
      const userCase = {
        respondents: [
          {
            ccdId: '1',
            responseReceived: 'Yes',
            respondentName: 'John Doe',
            responseRespondentName: 'John Doe Test',
            responseRespondentAddress: {
              AddressLine1: '123 High St',
              AddressLine2: '',
              PostTown: 'Oxford',
              PostCode: 'OX1 1AA',
              Country: 'UK',
            },
            responseRespondentEmail: 'john@example.com',
            responseRespondentContactPreference: 'Email',
          },
        ],
      } as CaseWithId;
      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(5);
      expect(result[0][0].key.text).toBe('Name');
      expect(result[0][0].value.text).toBe('John Doe');
      expect(result[0][1].key.text).toBe('Employer name');
      expect(result[0][1].value.text).toBe('John Doe Test');
      expect(result[0][2].key.text).toBe('Address');
      expect(result[0][2].value.text).toBe('123 High St, Oxford, OX1 1AA, UK');
      expect(result[0][3].key.text).toBe('Email');
      expect(result[0][3].value.text).toBe('john@example.com');
      expect(result[0][4].key.text).toBe('Preferred method of contact');
      expect(result[0][4].value.text).toBe('Email');
    });

    it('should return representative details if one is assigned', () => {
      const userCase: CaseWithId = {
        respondents: [
          {
            ccdId: '1',
            respondentName: 'Acme Corp',
            responseRespondentName: 'Acme Corp ET3',
            responseRespondentAddress: {
              AddressLine1: '100 Industrial Rd',
              AddressLine2: '',
              PostTown: 'Birmingham',
              PostCode: 'B1 1BB',
              Country: 'UK',
            },
            responseRespondentEmail: 'contact@acme.com',
          },
        ],
        representatives: [
          {
            respondentId: '1',
            nameOfRepresentative: 'Jane Rep',
            nameOfOrganisation: 'Rep Co',
            representativeAddress: {
              AddressLine1: '200 Law St',
              AddressLine2: '',
              PostTown: 'Leeds',
              PostCode: 'LS1 2AA',
              Country: 'UK',
            },
            representativeEmailAddress: 'jane@repco.com',
            representativePreference: 'Email',
          },
        ],
      } as CaseWithId;
      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(5);
      expect(result[0][0].key.text).toBe('Legal representative’s name');
      expect(result[0][0].value.text).toBe('Jane Rep');
      expect(result[0][1].key.text).toBe('Legal rep’s organisation');
      expect(result[0][1].value.text).toBe('Rep Co');
      expect(result[0][2].key.text).toBe('Address');
      expect(result[0][2].value.text).toBe('200 Law St, Leeds, LS1 2AA, UK');
      expect(result[0][3].key.text).toBe('Email');
      expect(result[0][3].value.text).toBe('jane@repco.com');
    });

    it('should handle multiple respondents with mixed representation', () => {
      const userCase: CaseWithId = {
        respondents: [
          {
            ccdId: '1',
            respondentName: 'Name One',
            responseRespondentName: 'Company One',
            responseRespondentAddress: {
              AddressLine1: '1 Corp Way',
              AddressLine2: '',
              PostTown: 'Townsville',
              PostCode: 'T1 1ZZ',
              Country: 'UK',
            },
            responseRespondentEmail: 'one@company.com',
          },
          {
            ccdId: '2',
            responseReceived: 'Yes',
            respondentName: 'Name Two',
            responseRespondentName: 'Company Two',
            responseRespondentAddress: {
              AddressLine1: '2 Biz Rd',
              AddressLine2: '',
              PostTown: 'Cityplace',
              PostCode: 'C2 2YY',
              Country: 'UK',
            },
            responseRespondentEmail: 'two@company.com',
          },
        ],
        representatives: [
          {
            respondentId: '1',
            nameOfRepresentative: 'Legal Rep 1',
            nameOfOrganisation: 'Legal Co 1',
            representativeAddress: {
              AddressLine1: '101 Justice Ave',
              AddressLine2: '',
              PostTown: 'Legaltown',
              PostCode: 'L1 1AB',
              Country: 'UK',
            },
            representativeEmailAddress: 'rep1@legalco.com',
          },
        ],
      } as CaseWithId;
      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(4);
      expect(result[0][0].value.text).toBe('Legal Rep 1');
      expect(result[1]).toHaveLength(4);
      expect(result[1][0].value.text).toBe('Name Two');
    });

    it('should return empty array if ET3 is not received', () => {
      const userCase: CaseWithId = {
        respondents: [
          {
            ccdId: '1',
            responseReceived: 'No',
          },
        ],
      } as CaseWithId;
      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(0);
    });

    it('should return false if respondents is undefined', () => {
      const userCase: CaseWithId = {
        respondents: undefined,
      } as CaseWithId;
      const req = mockRequestWithTranslation({ session: { userCase } }, translations);
      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(0);
    });
  });
});
