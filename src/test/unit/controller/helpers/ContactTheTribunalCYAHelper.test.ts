import { getCyaContent } from '../../../../main/controllers/helpers/ContactTheTribunalCYAHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import welshCommon from '../../../../main/resources/locales/cy/translation/common.json';
import welshContactTheTribunalCYARaw from '../../../../main/resources/locales/cy/translation/contact-the-tribunal-cya.json';
import welshContactTheTribunalRaw from '../../../../main/resources/locales/cy/translation/contact-the-tribunal.json';
import contactTheTribunalCYARaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal-cya.json';
import contactTheTribunalRaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Contact the tribunal CYA controller', () => {
  it('should return expected CYA content', () => {
    const welshTranslationJsons = {
      ...welshContactTheTribunalCYARaw,
      ...welshContactTheTribunalRaw,
      ...welshCommon,
    };
    const req = mockRequestWithTranslation({}, welshTranslationJsons);
    const userCase = req.session.userCase;
    userCase.contactApplicationText = 'contactApplicationText';
    userCase.contactApplicationType = 'withdraw';
    userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
    userCase.copyToOtherPartyText = 'copyToOtherPartyText';
    userCase.respondents = [
      {
        ccdId: '1',
      },
    ];
    userCase.representatives = [
      {
        respondentId: '1',
        hasMyHMCTSAccount: YesOrNo.YES,
      },
    ];

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const appContent = getCyaContent(
      userCase,
      translations,
      '?lng=cy',
      '/contact-the-tribunal/withdraw',
      'downloadLink',
      translations.sections['change-details'].label
    );

    expect(appContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: translations.applicationType });
    expect(appContent[0].value).toEqual({ text: translations.sections['change-details'].label });
    expect(appContent[0].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal?lng=cy',
          text: translations.change,
          visuallyHiddenText: translations.applicationType,
        },
      ],
    });
    expect(appContent[1].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.legend,
    });
    expect(appContent[1].value).toEqual({ text: 'contactApplicationText' });
    expect(appContent[1].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=cy',
          text: translations.change,
          visuallyHiddenText: translations.legend,
        },
      ],
    });
    expect(appContent[2].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.supportingMaterial,
    });
    expect(appContent[2].value).toEqual({ html: 'downloadLink' });
    expect(appContent[2].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=cy',
          text: translations.change,
          visuallyHiddenText: translations.supportingMaterial,
        },
      ],
    });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.copyToOtherPartyYesOrNo,
    });
    expect(appContent[3].value).toEqual({ text: translations.no });
    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party?lng=cy',
          text: translations.change,
          visuallyHiddenText: translations.copyToOtherPartyYesOrNo,
        },
      ],
    });
    expect(appContent[4].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.copyToOtherPartyText,
    });
    expect(appContent[4].value).toEqual({ text: userCase.copyToOtherPartyText });
    expect(appContent[4].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party?lng=cy',
          text: translations.change,
          visuallyHiddenText: translations.copyToOtherPartyText,
        },
      ],
    });
  });

  it('should return expected CYA content with non-system user - English language', () => {
    const translationJsons = { ...contactTheTribunalRaw, ...contactTheTribunalCYARaw };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    userCase.contactApplicationText = 'contactApplicationText';
    userCase.respondents = undefined;
    userCase.representatives = undefined;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const appContent = getCyaContent(
      userCase,
      translations,
      '?lng=en',
      '/contact-the-tribunal/withdraw',
      'downloadLink',
      'I want to change my personal details'
    );

    expect(appContent[0].key).toEqual({ classes: 'govuk-!-font-weight-regular-m', text: translations.applicationType });
    expect(appContent[0].value).toEqual({ text: translations.sections['change-details'].label });
    expect(appContent[0].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal?lng=en',
          text: translations.change,
          visuallyHiddenText: translations.applicationType,
        },
      ],
    });
    expect(appContent[1].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.legend,
    });
    expect(appContent[1].value).toEqual({ text: 'contactApplicationText' });
    expect(appContent[1].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=en',
          text: translations.change,
          visuallyHiddenText: translations.legend,
        },
      ],
    });
    expect(appContent[2].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.supportingMaterial,
    });
    expect(appContent[2].value).toEqual({ html: 'downloadLink' });
    expect(appContent[2].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=en',
          text: translations.change,
          visuallyHiddenText: translations.supportingMaterial,
        },
      ],
    });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations.copyToOtherPartyYesOrNo,
    });
    expect(appContent[3].value).toEqual({ text: translations.no });
    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party-not-system-user?lng=en',
          text: translations.change,
          visuallyHiddenText:
            'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
        },
      ],
    });
  });
});
