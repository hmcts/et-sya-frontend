import { getTseApplicationDetails } from '../../../../main/controllers/helpers/ApplicationDetailsHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import applicationDetailsRaw from '../../../../main/resources/locales/en/translation/application-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Application details', () => {
  it('should return expected application details', () => {
    const genericTseApplicationType = {
      number: '1',
      status: 'inProgress',
      type: 'withdraw',
      applicant: 'James',
      date: '2022-12-12',
      details: 'test details',
      copyToOtherPartyYesOrNo: YesOrNo.NO,
      copyToOtherPartyText: 'test reason',
    } as GenericTseApplicationType;

    const selectedApplication = {
      value: genericTseApplicationType,
      linkValue: 'withdraw',
    } as GenericTseApplicationTypeItem;

    const translationJsons = { ...applicationDetailsRaw };

    const req = mockRequestWithTranslation({}, translationJsons);
    req.session.userCase.genericTseApplicationCollection = [selectedApplication];
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    const appContent = getTseApplicationDetails(selectedApplication, translations, 'downloadLink');

    expect(appContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Applicant' });
    expect(appContent[0].value).toEqual({ text: 'James' });
    expect(appContent[1].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Request date' });
    expect(appContent[1].value).toEqual({ text: '2022-12-12' });
    expect(appContent[2].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Application type' });
    expect(appContent[2].value).toEqual({ text: 'withdraw my claim' });
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
    expect(appContent[5].value).toEqual({ text: YesOrNo.NO });
    expect(appContent[6].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Reason for not informing other party',
    });
    expect(appContent[6].value).toEqual({ text: 'test reason' });
  });
});
