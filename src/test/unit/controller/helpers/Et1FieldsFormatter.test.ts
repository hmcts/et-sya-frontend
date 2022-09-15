import { getEt1DetailsFormatted } from '../../../../main/controllers/helpers/Et1FieldsFormatter';
import { CaseDate, CaseWithId, EmailOrPost, HearingPreference, Sex, YesOrNo } from '../../../../main/definitions/case';

describe('Test formatting of ET1 field values', () => {
  it('Formats inputted values', () => {
    const formatted = getEt1DetailsFormatted({
      dobDate: { day: '19', month: '6', year: '1964' } as CaseDate,
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
      address1: '10 Downing St',
      address2: 'McPM',
      addressTown: 'London',
      addressCountry: 'UK',
      addressPostcode: 'SW1A 2AA',
      telNumber: '020 7219 4682',
      claimantContactPreference: EmailOrPost.EMAIL,
      hearingPreferences: [HearingPreference.PHONE, HearingPreference.VIDEO],
      reasonableAdjustments: YesOrNo.YES,
      reasonableAdjustmentsDetail: 'I need reasonable adjustments',
    } as CaseWithId);

    expect(formatted).toStrictEqual({
      dob: '19-6-1964',
      sex: Sex.MALE,
      title: 'Mr',
      address: '10 Downing St, McPM, London, UK, SW1A 2AA',
      phone: '020 7219 4682',
      contactPreference: EmailOrPost.EMAIL,
      hearingPreference: [HearingPreference.PHONE, HearingPreference.VIDEO],
      reasonableAdjustments: 'Yes, I need reasonable adjustments',
    });
  });

  it('Formats empty values', () => {
    // For values of non-string type, undefined is entered and received
    // These are mandatory and so their values here are irrelevant
    const formatted = getEt1DetailsFormatted({
      dobDate: {} as CaseDate,
      telNumber: '',
      reasonableAdjustments: '',
    } as unknown as CaseWithId);

    expect(formatted).toStrictEqual({
      dob: '',
      sex: undefined,
      title: 'Not Selected',
      address: '',
      phone: 'Not Provided',
      contactPreference: undefined,
      hearingPreference: undefined,
      reasonableAdjustments: '',
    });
  });
});
