import { getRespondentContactDetails } from '../../../../main/controllers/helpers/RespondentContactDetailsHelper';
import { CaseWithId } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';
import respondentContactDetailsJson from '../../../../main/resources/locales/en/translation/respondent-contact-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respondent Contact Details Helper', () => {
  describe('getRespondentContactDetails', () => {
    const translations: AnyRecord = {
      ...respondentContactDetailsJson,
    };

    it('should return respondent details if no representative is assigned', () => {
      const userCase = {
        respondents: [
          {
            ccdId: '1',
            respondentName: 'John Doe',
            respondentAddress1: '123 High St',
            respondentAddress2: '',
            respondentAddressTown: 'Oxford',
            respondentAddressPostcode: 'OX1 1AA',
            respondentAddressCountry: 'UK',
            respondentEmail: 'john@example.com',
          },
        ],
        representatives: [],
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(3);
      expect(result[0][0].key.text).toBe('Name');
      expect(result[0][0].value.text).toBe('John Doe');
      expect(result[0][1].key.text).toBe('Address');
      expect(result[0][1].value.text).toBe('123 High St, Oxford, OX1 1AA, UK');
      expect(result[0][2].key.text).toBe('Email');
      expect(result[0][2].value.text).toBe('john@example.com');
    });

    it('should return representative details if one is assigned', () => {
      const userCase: CaseWithId = {
        respondents: [
          {
            ccdId: '1',
            respondentName: 'Acme Corp',
            respondentAddress1: '100 Industrial Rd',
            respondentAddress2: '',
            respondentAddressTown: 'Birmingham',
            respondentAddressPostcode: 'B1 1BB',
            respondentAddressCountry: 'UK',
            respondentEmail: 'contact@acme.com',
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
          },
        ],
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getRespondentContactDetails(req);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(4);
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
            respondentName: 'Company One',
            respondentAddress1: '1 Corp Way',
            respondentAddress2: '',
            respondentAddressTown: 'Townsville',
            respondentAddressPostcode: 'T1 1ZZ',
            respondentAddressCountry: 'UK',
            respondentEmail: 'one@company.com',
          },
          {
            ccdId: '2',
            respondentName: 'Company Two',
            respondentAddress1: '2 Biz Rd',
            respondentAddress2: '',
            respondentAddressTown: 'Cityplace',
            respondentAddressPostcode: 'C2 2YY',
            respondentAddressCountry: 'UK',
            respondentEmail: 'two@company.com',
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
      expect(result[0][0].value.text).toBe('Legal Rep 1');
      expect(result[1][0].value.text).toBe('Company Two');
    });
  });
});
