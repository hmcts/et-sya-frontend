import { getYourDetails } from '../../../../main/controllers/helpers/YourDetailsAnswersHelper';
import { CaseTypeId, CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../../main/modules/featureFlag/CuiYourSupportFeature';

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

  it('should link the support change action to reasonable adjustments by default', () => {
    const rows = getYourDetails({ caseTypeId: CaseTypeId.ENGLAND_WALES } as CaseWithId, translations);
    const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

    expect(supportRow?.actions?.items[0].href).toBe(PageUrls.REASONABLE_ADJUSTMENTS + InterceptPaths.ANSWERS_CHANGE);
  });

  it('should link the support change action to your support when enabled for the case type', () => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    try {
      const rows = getYourDetails({ caseTypeId: CaseTypeId.SCOTLAND } as CaseWithId, translations);
      const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

      expect(supportRow?.actions?.items[0].href).toBe(PageUrls.YOUR_SUPPORT + InterceptPaths.ANSWERS_CHANGE);
    } finally {
      featureMock.mockRestore();
    }
  });

  it('should display the legacy reasonable adjustments detail text by default', () => {
    const rows = getYourDetails(
      {
        caseTypeId: CaseTypeId.ENGLAND_WALES,
        reasonableAdjustments: YesOrNo.YES,
        reasonableAdjustmentsDetail: 'Old free text answer',
      } as CaseWithId,
      translations
    );
    const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

    expect(supportRow?.value.text).toBe(`${translations.oesYesOrNo.yes}, Old free text answer`);
  });

  it('should not display the legacy reasonable adjustments detail text when CUI your support is enabled', () => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    try {
      const rows = getYourDetails(
        {
          caseTypeId: CaseTypeId.SCOTLAND,
          reasonableAdjustments: YesOrNo.YES,
          reasonableAdjustmentsDetail: 'Old free text answer',
        } as CaseWithId,
        translations
      );
      const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

      expect(supportRow?.value.text).toBe(translations.oesYesOrNo.yes);
    } finally {
      featureMock.mockRestore();
    }
  });

  it('should not display legacy detail text when none was entered', () => {
    const rows = getYourDetails(
      {
        caseTypeId: CaseTypeId.ENGLAND_WALES,
        reasonableAdjustments: YesOrNo.YES,
      } as CaseWithId,
      translations
    );
    const supportRow = rows.find(row => row.key.text === translations.personalDetails.disability);

    expect(supportRow?.value.text).toBe(translations.oesYesOrNo.yes);
  });
});
