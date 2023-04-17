import { getRespondentCyaContent } from '../../../../main/controllers/helpers/RespondentApplicationCYAHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { CHANGE, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import respondentCYARaw from '../../../../main/resources/locales/en/translation/respondent-application-cya.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respondent application CYA controller helper', () => {
  it('should return expected content', () => {
    const translationJsons = { ...respondentCYARaw };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    userCase.responseText = 'responseText';
    userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
    userCase.copyToOtherPartyText = 'copyToOtherPartyText';

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_CYA, { returnObjects: true }),
    };

    const appContent = getRespondentCyaContent(
      userCase,
      translations,
      '?lng=cy',
      '/supporting-material',
      'downloadLink'
    );

    expect(appContent[0].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: "What's your response to the respondent's application?",
    });
    expect(appContent[0].value).toEqual({ text: 'responseText' });
    expect(appContent[0].actions).toEqual({
      items: [
        {
          href: '/supporting-material?lng=cy',
          text: CHANGE,
          visuallyHiddenText: "What's your response to the respondent's application?",
        },
      ],
    });
    expect(appContent[1].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Supporting material',
    });
    expect(appContent[1].value).toEqual({ html: 'downloadLink' });
    expect(appContent[1].actions).toEqual({
      items: [
        {
          href: '/supporting-material?lng=cy',
          text: CHANGE,
          visuallyHiddenText: 'Supporting material',
        },
      ],
    });
    expect(appContent[2].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(appContent[2].value).toEqual({ text: 'No' });
    expect(appContent[2].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party?lng=cy',
          text: CHANGE,
          visuallyHiddenText:
            'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
        },
      ],
    });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Reason for not informing other party',
    });
    expect(appContent[3].value).toEqual({ text: 'copyToOtherPartyText' });
    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party?lng=cy',
          text: CHANGE,
          visuallyHiddenText: 'Reason for not informing other party',
        },
      ],
    });
  });
});
