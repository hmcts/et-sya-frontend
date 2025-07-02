import { getRespondentCyaContent } from '../../../../main/controllers/helpers/RespondentApplicationCYAHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';
import common from '../../../../main/resources/locales/en/translation/common.json';
import respondentCYARaw from '../../../../main/resources/locales/en/translation/respondent-application-cya.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respondent application CYA controller helper', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should return expected content', () => {
    const translationJsons = { ...respondentCYARaw, ...common };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    userCase.responseText = 'responseText';
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
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const appContent = getRespondentCyaContent(
      userCase,
      translations,
      languages.ENGLISH_URL_PARAMETER,
      '/supporting-material',
      'downloadLink',
      '/respond-to-application/9ced468b-000d-4b1a-8843-9faaa7bbd2e6'
    );

    expect(appContent[0].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: "What's your response to the other party's application?",
    });
    expect(appContent[0].value).toEqual({ text: 'responseText' });
    expect(appContent[0].actions).toEqual({
      items: [
        {
          href: '/respond-to-application/9ced468b-000d-4b1a-8843-9faaa7bbd2e6' + languages.ENGLISH_URL_PARAMETER,
          text: common.change,
          visuallyHiddenText: respondentCYARaw.legend,
        },
      ],
    });
    expect(appContent[1].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: respondentCYARaw.supportingMaterial,
    });
    expect(appContent[1].value).toEqual({ html: 'downloadLink' });
    expect(appContent[1].actions).toEqual({
      items: [
        {
          href: '/supporting-material?lng=en',
          text: common.change,
          visuallyHiddenText: respondentCYARaw.supportingMaterial,
        },
      ],
    });
    expect(appContent[2].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: respondentCYARaw.copyToOtherPartyYesOrNo,
    });
    expect(appContent[2].value).toEqual({ text: YesOrNo.NO });
    expect(appContent[2].actions).toEqual({
      items: [
        {
          href: PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER,
          text: common.change,
          visuallyHiddenText: respondentCYARaw.copyToOtherPartyYesOrNo,
        },
      ],
    });
    expect(appContent[3].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: respondentCYARaw.copyToOtherPartyText,
    });
    expect(appContent[3].value).toEqual({ text: 'copyToOtherPartyText' });
    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER,
          text: common.change,
          visuallyHiddenText: respondentCYARaw.copyToOtherPartyText,
        },
      ],
    });
  });

  it('should return expected content with non system user', () => {
    const translationJsons = { ...respondentCYARaw, ...common };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    userCase.responseText = 'responseText';
    userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
    userCase.copyToOtherPartyText = 'copyToOtherPartyText';

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const appContent = getRespondentCyaContent(
      userCase,
      translations,
      languages.ENGLISH_URL_PARAMETER,
      '/supporting-material',
      'downloadLink',
      '/respond-to-application'
    );

    expect(appContent[3].actions).toEqual({
      items: [
        {
          href: '/copy-to-other-party-not-system-user?lng=en',
          text: common.change,
          visuallyHiddenText: 'Reason for not informing other party',
        },
      ],
    });
  });

  it('should return content without Rule92 section if Rule92 page skipped(e.g.it is has ECC)', () => {
    const translationJsons = { ...respondentCYARaw };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    userCase.responseText = 'responseText';
    userCase.copyToOtherPartyYesOrNo = undefined;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_CYA, { returnObjects: true }),
    };

    const appContent = getRespondentCyaContent(
      userCase,
      translations,
      languages.ENGLISH_URL_PARAMETER,
      '/supporting-material',
      'downloadLink',
      '/respond-to-application'
    );
    expect(appContent[2]).toEqual(undefined);
  });
});
