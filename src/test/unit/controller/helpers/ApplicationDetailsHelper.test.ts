import { getTseApplicationDetails } from '../../../../main/controllers/helpers/ApplicationDetailsHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import applicationDetailsRaw from '../../../../main/resources/locales/en/translation/application-details.json';
import commonRaw from '../../../../main/resources/locales/en/translation/common.json';
import yourApplicationsRaw from '../../../../main/resources/locales/en/translation/your-applications.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

const summaryListClass = 'govuk-!-font-weight-regular-m';

describe('Application details', () => {
  const genericTseApplicationType = {
    number: '1',
    status: 'inProgress',
    type: 'withdraw',
    applicant: 'Claimant',
    date: '12 December 2022',
    details: 'test details',
    copyToOtherPartyYesOrNo: YesOrNo.NO,
    copyToOtherPartyText: 'test reason',
    respondCollection: [
      {
        id: '1',
        value: {
          from: Applicant.RESPONDENT,
          date: '20 March 2023',
          response: 'Response text',
          copyToOtherParty: YesOrNo.YES,
        },
      },
    ],
  } as GenericTseApplicationType;

  const selectedApplication = {
    value: genericTseApplicationType,
    linkValue: 'withdraw',
  } as GenericTseApplicationTypeItem;

  const translationJsons = { ...applicationDetailsRaw, ...yourApplicationsRaw, ...commonRaw };
  const req = mockRequestWithTranslation({}, translationJsons);
  req.session.userCase.genericTseApplicationCollection = [selectedApplication];
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
  };

  const appContent = getTseApplicationDetails(
    selectedApplication,
    translations,
    'downloadLink',
    genericTseApplicationType.date
  );

  it('should return expected application details', async () => {
    expect(appContent[0].key).toEqual({ classes: summaryListClass, text: 'Applicant' });
    expect(appContent[0].value).toEqual({ text: 'Claimant' });
    expect(appContent[1].key).toEqual({ classes: summaryListClass, text: 'Application date' });
    expect(appContent[1].value).toEqual({ text: '12 December 2022' });
    expect(appContent[2].key).toEqual({ classes: summaryListClass, text: 'Application type' });
    expect(appContent[2].value).toEqual({ text: 'Withdraw my claim' });
    expect(appContent[3].key).toEqual({
      classes: summaryListClass,
      text: 'What do you want to tell or ask the tribunal?',
    });
    expect(appContent[3].value).toEqual({ text: 'test details' });
    expect(appContent[4].key).toEqual({ classes: summaryListClass, text: 'Supporting material' });
    expect(appContent[4].value).toEqual({ html: 'downloadLink' });
    expect(appContent[5].key).toEqual({
      classes: summaryListClass,
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(appContent[5].value).toEqual({ text: YesOrNo.NO });
    expect(appContent[6].key).toEqual({
      classes: summaryListClass,
      text: 'Reason for not informing other party',
    });
    expect(appContent[6].value).toEqual({ text: 'test reason' });
  });

  it('should return expected application details with Stored wordings', () => {
    const genericTseApplicationType2 = {
      number: '1',
      status: 'Stored',
      type: 'withdraw',
      applicant: 'Claimant',
      date: '2022-12-12',
      details: 'test details',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
    } as GenericTseApplicationType;

    const selectedApplication2 = {
      value: genericTseApplicationType2,
      linkValue: 'withdraw',
    } as GenericTseApplicationTypeItem;

    const translationJsons2 = { ...applicationDetailsRaw };
    const req2 = mockRequestWithTranslation({}, translationJsons2);
    const translations2: AnyRecord = {
      ...req2.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    const appContent2 = getTseApplicationDetails(
      selectedApplication2,
      translations2,
      'downloadLink',
      Date.now().toString()
    );

    expect(appContent2[1].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Application stored date' });
  });
});
