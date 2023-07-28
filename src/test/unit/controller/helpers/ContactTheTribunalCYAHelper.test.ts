import { getCyaContent } from '../../../../main/controllers/helpers/ContactTheTribunalCYAHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { CHANGE, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import contactTheTribunalCYARaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal-cya.json';
import contactTheTribunalRaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Contact the tribunal CYA controller', () => {
  it('should return expected CYA content', () => {
    const translationJsons = { ...contactTheTribunalRaw, ...contactTheTribunalCYARaw };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    userCase.contactApplicationText = 'contactApplicationText';
    userCase.contactApplicationType = 'withdraw';
    userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
    userCase.copyToOtherPartyText = 'copyToOtherPartyText';

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
    };

    const appContent = getCyaContent(
      userCase,
      translations,
      '?lng=cy',
      '/contact-the-tribunal/withdraw',
      'downloadLink',
      'I want to change my personal details'
    );

    expect(appContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Application type' });
    expect(appContent[0].value).toEqual({ text: 'I want to change my personal details' });
    expect(appContent[0].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal?lng=cy',
          text: CHANGE,
          visuallyHiddenText: translations.applicationType,
        },
      ],
    });
    expect(appContent[1].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'What do you want to tell or ask the tribunal?',
    });
    expect(appContent[1].value).toEqual({ text: 'contactApplicationText' });
    expect(appContent[1].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=cy',
          text: CHANGE,
          visuallyHiddenText: 'What do you want to tell or ask the tribunal?',
        },
      ],
    });
    expect(appContent[2].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: 'Supporting material' });
    expect(appContent[2].value).toEqual({ html: 'downloadLink' });
    expect(appContent[2].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=cy',
          text: CHANGE,
          visuallyHiddenText: 'Supporting material',
        },
      ],
    });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
    });
    expect(appContent[3].value).toEqual({ text: 'No' });
    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party?lng=cy',
          text: CHANGE,
          visuallyHiddenText:
            'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
        },
      ],
    });
    expect(appContent[4].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'Reason for not informing other party',
    });
    expect(appContent[4].value).toEqual({ text: 'copyToOtherPartyText' });
    expect(appContent[4].actions).toEqual({
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
