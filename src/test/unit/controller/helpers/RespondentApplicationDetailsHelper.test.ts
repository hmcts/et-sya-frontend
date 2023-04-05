import { getTseApplicationDetails } from '../../../../main/controllers/helpers/ApplicationDetailsHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { CLAIMANT, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import applicationDetailsRaw from '../../../../main/resources/locales/en/translation/respondent-application-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respondent application details', () => {
  it('should return expected respondent application details', () => {
    const genericTseApplicationType = {
      number: '1',
      status: 'inProgress',
      type: 'Amend response',
      applicant: 'Respondent',
      date: '2 March 2023',
      details: 'test details',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      respondCollection: [
        {
          id: '1',
          value: {
            from: CLAIMANT,
            date: '20 March 2023',
            response: 'Response text',
            copyToOtherParty: YesOrNo.YES,
          },
        },
      ],
      adminDecision: [
        {
          id: '1',
          value: {
            date: '3 March 2020',
            decision: 'Granted',
            decisionMadeBy: 'Judge',
            decisionMadeByFullName: 'Mr Judgey',
            typeOfDecision: 'Judgment',
            selectPartyNotify: 'Both',
            additionalInformation: 'Additional info test text',
            enterNotificationTitle: 'Decision title test text',
          },
        },
      ],
    } as GenericTseApplicationType;

    const selectedApplication = {
      value: genericTseApplicationType,
      linkValue: 'amend response',
    } as GenericTseApplicationTypeItem;

    const translationJsons = { ...applicationDetailsRaw };
    const summaryListClass = 'govuk-!-font-weight-regular-m';

    const req = mockRequestWithTranslation({}, translationJsons);
    req.session.userCase.genericTseApplicationCollection = [selectedApplication];
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
    };

    const appContent = getTseApplicationDetails(selectedApplication, translations, 'downloadLink');

    expect(appContent[0].key).toEqual({ classes: summaryListClass, text: 'Applicant' });
    expect(appContent[0].value).toEqual({ text: 'Respondent' });
    expect(appContent[1].key).toEqual({ classes: summaryListClass, text: 'Application date' });
    expect(appContent[1].value).toEqual({ text: '2 March 2023' });
    expect(appContent[2].key).toEqual({ classes: summaryListClass, text: 'Application type' });
    expect(appContent[2].value).toEqual({ text: 'amend response' });
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
    expect(appContent[5].value).toEqual({ text: YesOrNo.YES });
  });
});
