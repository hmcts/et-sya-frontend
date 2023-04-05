import { getTseApplicationDetails } from '../../../../main/controllers/helpers/ApplicationDetailsHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../../../main/definitions/constants';
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
    } as GenericTseApplicationType;

    const selectedApplication = {
      value: genericTseApplicationType,
      linkValue: 'amend response',
    } as GenericTseApplicationTypeItem;

    const translationJsons = { ...applicationDetailsRaw };

    const req = mockRequestWithTranslation({}, translationJsons);
    req.session.userCase.genericTseApplicationCollection = [selectedApplication];
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
    };

    const appContent = getTseApplicationDetails(selectedApplication, translations, 'downloadLink');

    expect(appContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Applicant' });
    expect(appContent[0].value).toEqual({ text: 'Respondent' });
    expect(appContent[1].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Application date' });
    expect(appContent[1].value).toEqual({ text: '2 March 2023' });
    expect(appContent[2].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Application type' });
    expect(appContent[2].value).toEqual({ text: 'amend response' });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'What do you want to tell or ask the tribunal?',
    });
    expect(appContent[3].value).toEqual({ text: 'test details' });
    expect(appContent[4].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Supporting material' });
    expect(appContent[4].value).toEqual({ html: 'downloadLink' });
    expect(appContent[5].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(appContent[5].value).toEqual({ text: YesOrNo.YES });
  });
});
