import { getCyaContent } from '../../../../main/controllers/helpers/ContactTheTribunalCYAHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { CHANGE, TranslationKeys } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import welshCommon from '../../../../main/resources/locales/cy/translation/common.json';
import welshContactTheTribunalCYARaw from '../../../../main/resources/locales/cy/translation/contact-the-tribunal-cya.json';
import welshContactTheTribunalRaw from '../../../../main/resources/locales/cy/translation/contact-the-tribunal.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Contact the tribunal CYA controller', () => {
  const translationJsons = { ...welshContactTheTribunalRaw, ...welshContactTheTribunalCYARaw };
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

  it('should return expected CYA content', () => {
    const welshTranslationJsons = {
      ...welshContactTheTribunalCYARaw,
      ...welshContactTheTribunalRaw,
      ...welshCommon,
    };
    const req2 = mockRequestWithTranslation({}, welshTranslationJsons);
    const userCase2 = req2.session.userCase;
    userCase2.contactApplicationText = 'contactApplicationText';
    userCase2.contactApplicationType = 'withdraw';
    userCase2.copyToOtherPartyYesOrNo = YesOrNo.NO;
    userCase2.copyToOtherPartyText = 'copyToOtherPartyText';

    const translations2: AnyRecord = {
      ...req2.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req2.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
      ...req2.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const appContent = getCyaContent(
      userCase2,
      translations2,
      '?lng=cy',
      '/contact-the-tribunal/withdraw',
      'downloadLink',
      translations2.sections['change-details'].label
    );

    expect(appContent[0].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations2.applicationType,
    });
    expect(appContent[0].value).toEqual({ text: translations2.sections['change-details'].label });
    expect(appContent[0].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal?lng=cy',
          text: translations2.change,
          visuallyHiddenText: translations2.applicationType,
        },
      ],
    });
    expect(appContent[1].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations2.legend,
    });
    expect(appContent[1].value).toEqual({ text: 'contactApplicationText' });
    expect(appContent[1].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=cy',
          text: translations2.change,
          visuallyHiddenText: translations2.legend,
        },
      ],
    });
    expect(appContent[2].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations2.supportingMaterial,
    });
    expect(appContent[2].value).toEqual({ html: 'downloadLink' });
    expect(appContent[2].actions).toEqual({
      items: [
        {
          href: '/contact-the-tribunal/withdraw?lng=cy',
          text: translations2.change,
          visuallyHiddenText: translations2.supportingMaterial,
        },
      ],
    });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations2.copyToOtherPartyYesOrNo,
    });
    expect(appContent[3].value).toEqual({ text: translations2.no });
    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party-not-system-user?lng=cy',
          text: CHANGE,
          visuallyHiddenText: translations2.copyToOtherPartyYesOrNo,
        },
      ],
    });
    expect(appContent[4].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: translations2.copyToOtherPartyText,
    });
    expect(appContent[4].value).toEqual({ text: userCase2.copyToOtherPartyText });
    expect(appContent[4].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party-not-system-user?lng=cy',
          text: CHANGE,
          visuallyHiddenText: translations2.copyToOtherPartyText,
        },
      ],
    });
  });

  it('should return expected CYA content with non-system user', () => {
    userCase.respondents = undefined;
    userCase.representatives = undefined;

    const appContent = getCyaContent(
      userCase,
      translations,
      '?lng=cy',
      '/contact-the-tribunal/withdraw',
      'downloadLink',
      'I want to change my personal details'
    );

    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party-not-system-user?lng=cy',
          text: CHANGE,
          visuallyHiddenText:
            'Ydych chi eisiau anfon copi o’r ohebiaeth hon at y parti arall i fodloni’r Rheolau Trefniadaeth?',
        },
      ],
    });
  });
});
