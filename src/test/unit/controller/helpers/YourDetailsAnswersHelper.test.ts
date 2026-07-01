import { getYourDetails } from '../../../../main/controllers/helpers/YourDetailsAnswersHelper';
import { CaseTypeId, CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../../main/definitions/constants';

describe('YourDetailsAnswersHelper', () => {
  const translations = {
    change: 'Change',
    contactDetails: {
      telephone: 'Telephone',
    },
    notProvided: 'Not provided',
    oesYesOrNo: {
      no: 'No',
      yes: 'Yes',
    },
    personalDetails: {
      contactOrHomeAddress: 'Contact or home address',
      disability: 'Support',
      dob: 'Date of birth',
      email: 'Email',
      english: 'English',
      female: 'Female',
      hearingLabel: 'Hearing language',
      howToBeContacted: 'How to be contacted',
      languageLabel: 'Contact language',
      male: 'Male',
      neither: 'Neither',
      phone: 'Phone',
      post: 'Post',
      preferNotToSay: 'Prefer not to say',
      sex: 'Sex',
      takePartInHearing: 'Take part in hearing',
      title: 'Title',
      video: 'Video',
      welsh: 'Welsh',
    },
  };

  it('should link the support change action to your support', () => {
    const rows = getYourDetails({ caseTypeId: CaseTypeId.ENGLAND_WALES } as CaseWithId, translations);
    const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

    expect(supportRow?.actions?.items[0].href).toBe(PageUrls.YOUR_SUPPORT + InterceptPaths.ANSWERS_CHANGE);
  });

  it('should not display the legacy reasonable adjustments detail text', () => {
    const rows = getYourDetails(
      {
        caseTypeId: CaseTypeId.ENGLAND_WALES,
        reasonableAdjustments: YesOrNo.YES,
        reasonableAdjustmentsDetail: 'Old free text answer',
      } as CaseWithId,
      translations
    );
    const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

    expect(supportRow?.value.text).toBe(translations.oesYesOrNo.yes);
  });
});
