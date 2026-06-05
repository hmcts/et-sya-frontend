import {
  applyPreservedClaimantRepSessionFields,
  getClaimantClaimDetails,
  getClaimantPersonalDetails,
  getClaimantRepAboutYouDetails,
  getClaimantRepAboutYouUrl,
  getClaimantRespondentSection,
  getRepresentativeDetails,
  populateClaimantRepDetailsFromCase,
} from '../../../../main/controllers/helpers/ClaimantRepAnswersHelper';
import {
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreference,
  Respondent,
  Sex,
  YesOrNo,
} from '../../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../../main/definitions/constants';
import { CaseState, ClaimTypeDiscrimination, ClaimTypePay } from '../../../../main/definitions/definition';
import et1DetailsJson from '../../../../main/resources/locales/en/translation/et1-details.json';

const translations = {
  ...et1DetailsJson,
  personalDetails: {
    email: 'Email',
    post: 'Post',
    welsh: 'Welsh',
    english: 'English',
    video: 'Video',
    phone: 'Phone',
    neither: 'Neither',
    male: 'Male',
    female: 'Female',
    preferNotToSay: 'Prefer not to say',
  },
  oesYesOrNo: { yes: 'Yes', no: 'No' },
  doYesOrNo: { yes: 'Yes', no: 'No' },
  notProvided: 'Not provided',
  change: 'Change',
  repDetails: {
    typeOfRepresentative: 'Type of representative',
    organisationName: "Name of the representative's organisation",
    representativeName: "Representative's name",
    representativeAddress: "Representative's address",
    representativeTelephone: "Representative's telephone number",
    howToBeContacted: 'How would you like us to contact you?',
    contactLanguage: 'What language do you want us to use when we contact you?',
    hearingLanguage: 'If a hearing is required, what language do you want to speak at a hearing?',
    hearingPreferences: 'Can you and the claimant attend hearings by video and phone?',
    disability: 'Does anyone in the claimant party have a disability?',
  },
  claimantDetails: {
    firstName: "Claimant's first name",
    lastName: "Claimant's last name",
    dob: 'Date of birth',
    sex: 'Sex',
    preferredTitle: 'Preferred title',
    address: 'Address',
    email: 'Email address',
  },
  respondentDetails: {
    respondentName: 'Name of respondent',
    respondentAddress: 'Respondent address',
    acasNumber: 'Do you have an Acas certificate number?',
  },
  claimDetails: {
    claimTypeDiscrimination: 'What type of discrimination claim are you making?',
    claimTypePay: 'What type of pay claim are you making?',
    describeWhatHappened: 'Describe what happened to you',
    ifClaimSuccessful: 'What do you want if your claim is successful',
    linkedCases: 'Linked cases',
  },
  discriminationClaims: { Age: 'Age' },
  payClaims: { Arrears: 'Arrears' },
  tellUsWhatYouWant: { compensation: 'Compensation only' },
  aboutYouDetails: {
    name: 'Name',
    organisation: 'Organisation',
    typeOfOrganisation: 'Type of organisation',
    address: 'Address',
    email: 'Email',
    phone: 'Phone',
  },
};

const baseCase = {
  id: '1234',
  state: CaseState.DRAFT,
} as CaseWithId;

describe('ClaimantRepAnswersHelper', () => {
  describe('getClaimantRepAboutYouUrl', () => {
    it('should build the about you page url for a case', () => {
      expect(getClaimantRepAboutYouUrl('case-123', '')).toBe('/claimant-rep-about-you/case-123');
    });
  });

  describe('applyPreservedClaimantRepSessionFields', () => {
    it('should keep an updated representative name after reloading case data from the api', () => {
      const userCase = {
        ...baseCase,
        claimantRepresentative: {
          name_of_representative: 'Old Name',
        },
      };
      applyPreservedClaimantRepSessionFields(userCase, {
        representativeName: 'Updated Name',
      });

      expect(userCase.representativeName).toBe('Updated Name');
      expect(userCase.claimantRepresentative?.name_of_representative).toBe('Updated Name');
    });
  });

  describe('populateClaimantRepDetailsFromCase', () => {
    it('should populate representative fields from case data when not already set', () => {
      const userCase = {
        ...baseCase,
        claimantRepresentative: {
          name_of_representative: 'Wolfie Smith',
          name_of_organisation: 'Tooting Popular Front',
        },
        telNumber: '0208 123 1234',
        representatives: [
          {
            nameOfRepresentative: 'Rep From Collection',
            nameOfOrganisation: 'Collection Org',
            representativeAddress: {
              AddressLine1: '1 Tooting Broadway',
              PostTown: 'London',
              PostCode: 'SW17 1NE',
              Country: 'England',
            },
          },
        ],
      };

      populateClaimantRepDetailsFromCase(userCase);

      expect(userCase.representativeName).toBe('Wolfie Smith');
      expect(userCase.representativeOrgName).toBe('Tooting Popular Front');
      expect(userCase.representativePhoneNumber).toBe('0208 123 1234');
      expect(userCase.repAddress1).toBe('1 Tooting Broadway');
      expect(userCase.repAddressTown).toBe('London');
      expect(userCase.repAddressPostcode).toBe('SW17 1NE');
      expect(userCase.repAddressCountry).toBe('England');
    });

    it('should sync representative phone number from telNumber', () => {
      const userCase = {
        ...baseCase,
        telNumber: '0208 123 1234',
      };

      populateClaimantRepDetailsFromCase(userCase);

      expect(userCase.representativePhoneNumber).toBe('0208 123 1234');
    });

    it('should default email to the login email when not set on the case', () => {
      const userCase = {
        ...baseCase,
        representativeName: 'Wolfie Smith',
      };

      populateClaimantRepDetailsFromCase(userCase, { loginEmail: 'rep@example.com' });

      expect(userCase.claimantRepEmail).toBe('rep@example.com');
      expect(userCase.claimantRepresentative?.representative_email_address).toBe('rep@example.com');
    });

    it('should not overwrite existing representative fields', () => {
      const userCase = {
        ...baseCase,
        representativeName: 'Existing Name',
        claimantRepresentative: {
          name_of_representative: 'Wolfie Smith',
        },
      };

      populateClaimantRepDetailsFromCase(userCase);

      expect(userCase.representativeName).toBe('Existing Name');
    });
  });

  describe('getClaimantRepAboutYouDetails', () => {
    it('should return summary rows with change links only on editable fields', () => {
      const userCase = {
        ...baseCase,
        id: 'case-123',
        representativeType: 'Trade Union',
        representativeOrgName: 'Tooting Popular Front',
        representativeName: 'Wolfie Smith',
        repAddress1: '1 Tooting Broadway',
        repAddressTown: 'London',
        repAddressPostcode: 'SW17 1NE',
        representativePhoneNumber: '0208 123 1234',
        claimantRepEmail: 'WSmith@TPF.com',
      };
      const rows = getClaimantRepAboutYouDetails(userCase, translations);
      expect(rows).toHaveLength(6);
      expect(rows[0].value.text).toBe('Wolfie Smith');
      expect(rows[0].actions.items[0].href).toBe(
        PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', 'case-123') + InterceptPaths.REP_ABOUT_YOU_CHANGE
      );
      expect(rows[1].actions).toBeUndefined();
      expect(rows[2].actions).toBeUndefined();
      expect(rows[4].value.html).toContain('WSmith@TPF.com');
      expect(rows[4].actions.items[0].href).toBe(
        PageUrls.CLAIMANT_REP_EDIT_EMAIL.replace(':caseId', 'case-123') + InterceptPaths.REP_ABOUT_YOU_CHANGE
      );
      expect(rows[5].actions.items[0].href).toBe(
        PageUrls.REPRESENTATIVE_PHONE_NUMBER + InterceptPaths.REP_ABOUT_YOU_CHANGE
      );
    });

    it('should not append language param to change links', () => {
      const userCase = {
        ...baseCase,
        id: 'case-123',
        representativeName: 'Wolfie Smith',
        repAddress1: '1 Tooting Broadway',
        repAddressTown: 'London',
        repAddressCountry: 'England',
        claimantRepEmail: 'WSmith@TPF.com',
      };
      const rows = getClaimantRepAboutYouDetails(userCase, translations);
      expect(rows[0].actions.items[0].href).toBe(
        PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', 'case-123') + InterceptPaths.REP_ABOUT_YOU_CHANGE
      );
    });

    it('should display representative details from claimantRepresentative when session fields are unset', () => {
      const userCase = {
        ...baseCase,
        id: 'case-123',
        claimantRepresentative: {
          name_of_representative: 'Wolfie Smith',
          name_of_organisation: 'Tooting Popular Front',
          representative_email_address: 'WSmith@TPF.com',
        },
        representatives: [
          {
            nameOfRepresentative: 'Wolfie Smith',
            nameOfOrganisation: 'Tooting Popular Front',
            representativeAddress: {
              AddressLine1: '1 Tooting Broadway',
              PostTown: 'London',
              PostCode: 'SW17 1NE',
              Country: 'England',
            },
          },
        ],
        telNumber: '0208 123 1234',
      };
      const rows = getClaimantRepAboutYouDetails(userCase, translations);
      expect(rows[0].value.text).toBe('Wolfie Smith');
      expect(rows[1].value.text).toBe('Tooting Popular Front');
      expect(rows[3].value.text).toContain('1 Tooting Broadway');
      expect(rows[4].value.html).toContain('WSmith@TPF.com');
      expect(rows[5].value.text).toBe('0208 123 1234');
    });
  });

  describe('getRepresentativeDetails', () => {
    it('should return rows with provided values', () => {
      const userCase = {
        ...baseCase,
        representativeType: 'Trade Union',
        representativeOrgName: 'Union Org',
        representativeName: 'Wolfie Smith',
        repAddress1: '56 High Street',
        representativePhoneNumber: '01234567890',
        claimantContactPreference: EmailOrPost.EMAIL,
        claimantContactLanguagePreference: EnglishOrWelsh.ENGLISH,
        claimantHearingLanguagePreference: EnglishOrWelsh.WELSH,
        hearingPreferences: [HearingPreference.VIDEO, HearingPreference.PHONE],
        reasonableAdjustments: YesOrNo.NO,
      };
      const rows = getRepresentativeDetails(userCase, translations);
      expect(rows).toHaveLength(10);
      expect(rows[0].value.text).toBe('Trade Union');
      expect(rows[1].value.text).toBe('Union Org');
      expect(rows[2].value.text).toBe('Wolfie Smith');
      expect(rows[5].value.text).toBe('Email');
      expect(rows[6].value.text).toBe('English');
      expect(rows[7].value.text).toBe('Welsh');
      expect(rows[8].value.text).toBe('Video, Phone');
      expect(rows[9].value.text).toBe('No');
    });

    it('should show notProvided for missing fields', () => {
      const rows = getRepresentativeDetails(baseCase, translations);
      expect(rows[0].value.text).toBe('Not provided');
      expect(rows[4].value.text).toBe('Not provided');
    });

    it('should return Post for post contact preference', () => {
      const rows = getRepresentativeDetails({ ...baseCase, claimantContactPreference: EmailOrPost.POST }, translations);
      expect(rows[5].value.text).toBe('Post');
    });

    it('should return notProvided for unknown contact preference', () => {
      const rows = getRepresentativeDetails({ ...baseCase, claimantContactPreference: undefined }, translations);
      expect(rows[5].value.text).toBe('Not provided');
    });

    it('should return neither for hearing preference NEITHER', () => {
      const rows = getRepresentativeDetails(
        { ...baseCase, hearingPreferences: [HearingPreference.NEITHER] },
        translations
      );
      expect(rows[8].value.text).toBe('Neither');
    });

    it('should return notProvided when hearingPreferences is empty', () => {
      const rows = getRepresentativeDetails({ ...baseCase, hearingPreferences: [] }, translations);
      expect(rows[8].value.text).toBe('Not provided');
    });

    it('should show Yes with detail for reasonableAdjustments YES', () => {
      const rows = getRepresentativeDetails(
        { ...baseCase, reasonableAdjustments: YesOrNo.YES, reasonableAdjustmentsDetail: 'ramp needed' },
        translations
      );
      expect(rows[9].value.text).toBe('Yes, ramp needed');
    });

    it('should return notProvided for unknown reasonableAdjustments', () => {
      const rows = getRepresentativeDetails({ ...baseCase, reasonableAdjustments: undefined }, translations);
      expect(rows[9].value.text).toBe('Not provided');
    });
  });

  describe('getClaimantPersonalDetails', () => {
    it('should return rows with provided claimant values', () => {
      const userCase = {
        ...baseCase,
        firstName: 'Zebedee',
        lastName: 'Spring',
        dobDate: { year: '1990', month: '07', day: '01' },
        claimantSex: Sex.MALE,
        preferredTitle: 'Mr',
        address1: '27 Poultry',
        addressTown: 'London',
        addressPostcode: 'EC2R 8AJ',
        email: 'zebedee@test.com',
      };
      const rows = getClaimantPersonalDetails(userCase, translations);
      expect(rows).toHaveLength(7);
      expect(rows[0].value.text).toBe('Zebedee');
      expect(rows[1].value.text).toBe('Spring');
      expect(rows[2].value.text).toBe('01-07-1990');
      expect(rows[3].value.text).toBe('Male');
      expect(rows[4].value.text).toBe('Mr');
      expect(rows[6].value.text).toBe('zebedee@test.com');
    });

    it('should return notProvided for missing personal details', () => {
      const rows = getClaimantPersonalDetails(baseCase, translations);
      expect(rows[0].value.text).toBe('Not provided');
      expect(rows[6].value.text).toBe('Not provided');
    });

    it('should return Female for female sex', () => {
      const rows = getClaimantPersonalDetails({ ...baseCase, claimantSex: Sex.FEMALE }, translations);
      expect(rows[3].value.text).toBe('Female');
    });

    it('should return Prefer not to say for prefer not to say sex', () => {
      const rows = getClaimantPersonalDetails({ ...baseCase, claimantSex: Sex.PREFER_NOT_TO_SAY }, translations);
      expect(rows[3].value.text).toBe('Prefer not to say');
    });

    it('should return notProvided for unknown sex', () => {
      const rows = getClaimantPersonalDetails({ ...baseCase, claimantSex: undefined }, translations);
      expect(rows[3].value.text).toBe('Not provided');
    });

    it('should return notProvided when dobDate is absent', () => {
      const rows = getClaimantPersonalDetails({ ...baseCase, dobDate: undefined }, translations);
      expect(rows[2].value.text).toBe('Not provided');
    });
  });

  describe('getClaimantRespondentSection', () => {
    it('should return respondent rows', () => {
      const respondent: Respondent = {
        respondentName: 'Magic Roundabout',
        respondentAddress1: 'The Courtyard',
        respondentAddressTown: 'London',
        respondentAddressPostcode: 'EC3V 3LR',
        acasCertNum: 'R123456/11/11',
      } as Respondent;
      const rows = getClaimantRespondentSection(respondent, translations);
      expect(rows).toHaveLength(3);
      expect(rows[0].value.text).toBe('Magic Roundabout');
      expect(rows[2].value.text).toBe('R123456/11/11');
    });

    it('should show notProvided when respondent fields are missing', () => {
      const rows = getClaimantRespondentSection({} as Respondent, translations);
      expect(rows[0].value.text).toBe('Not provided');
      expect(rows[2].value.text).toBe('Not provided');
    });
  });

  describe('getClaimantClaimDetails', () => {
    it('should include discrimination row when typeOfClaim includes discrimination', () => {
      const userCase = {
        ...baseCase,
        typeOfClaim: ['discrimination'],
        claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE],
      };
      const rows = getClaimantClaimDetails(userCase, translations);
      expect(rows.some(r => r.key.text === 'What type of discrimination claim are you making?')).toBe(true);
    });

    it('should include pay row when typeOfClaim includes payRelated', () => {
      const userCase = { ...baseCase, typeOfClaim: ['payRelated'], claimTypePay: [ClaimTypePay.ARREARS] };
      const rows = getClaimantClaimDetails(userCase, translations);
      expect(rows.some(r => r.key.text === 'What type of pay claim are you making?')).toBe(true);
    });

    it('should always include describe what happened and linked cases rows', () => {
      const rows = getClaimantClaimDetails(baseCase, translations);
      expect(rows.some(r => r.key.text === 'Describe what happened to you')).toBe(true);
      expect(rows.some(r => r.key.text === 'Linked cases')).toBe(true);
    });

    it('should return Yes for linkedCases YES', () => {
      const rows = getClaimantClaimDetails({ ...baseCase, linkedCases: YesOrNo.YES }, translations);
      const linkedRow = rows.find(r => r.key.text === 'Linked cases');
      expect(linkedRow.value.text).toBe('Yes');
    });

    it('should return No for linkedCases NO', () => {
      const rows = getClaimantClaimDetails({ ...baseCase, linkedCases: YesOrNo.NO }, translations);
      const linkedRow = rows.find(r => r.key.text === 'Linked cases');
      expect(linkedRow.value.text).toBe('No');
    });

    it('should return notProvided for undefined linkedCases', () => {
      const rows = getClaimantClaimDetails({ ...baseCase, linkedCases: undefined }, translations);
      const linkedRow = rows.find(r => r.key.text === 'Linked cases');
      expect(linkedRow.value.text).toBe('Not provided');
    });
  });
});
