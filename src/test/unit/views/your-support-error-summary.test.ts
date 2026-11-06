import path from 'path';

import nunjucks from 'nunjucks';

import { PageUrls } from '../../../main/definitions/constants';
import commonCy from '../../../main/resources/locales/cy/translation/common.json';
import commonEn from '../../../main/resources/locales/en/translation/common.json';

const env = nunjucks.configure(
  [
    path.resolve(__dirname, '../../../main/views'),
    path.resolve(__dirname, '../../../../node_modules/govuk-frontend/dist'),
  ],
  { autoescape: true, watch: false }
);

describe.each([
  'steps-to-making-your-claim',
  'steps-to-making-your-claim-non-hmcts',
  'citizen-hub',
  'claimant-applications',
])('Support save error on %s', template => {
  const context: Record<string, unknown> = {
    PageUrls,
    currentUrl: '/',
    currentHost: 'localhost',
    userCase: { respondents: [] },
    sections: [],
    progressBarItems: [],
    myClaimsApplications: [],
    representingApplications: [],
  };

  it.each([
    { language: 'en', translations: commonEn },
    { language: 'cy', translations: commonCy },
  ])('should display the translated support save error in $language', ({ language, translations }) => {
    const html = env.render(`${template}.njk`, {
      ...context,
      ...translations,
      i18n: { language },
      yourSupportSaveError: true,
    });
    const document = new DOMParser().parseFromString(html, 'text/html');
    const summaries = document.querySelectorAll('.govuk-error-summary');

    expect(summaries).toHaveLength(1);
    expect(summaries[0].querySelector('.govuk-error-summary__title').textContent.trim()).toBe(
      translations.errorSummaryTitle
    );
    expect(summaries[0].querySelector('li').textContent.trim()).toBe(translations.yourSupportSaveErrorMessage);
  });

  it.each([false, undefined])('should not display a support save error when the error flag is %s', errorFlag => {
    const html = env.render(`${template}.njk`, {
      ...context,
      ...commonEn,
      i18n: { language: 'en' },
      yourSupportSaveError: errorFlag,
    });
    const document = new DOMParser().parseFromString(html, 'text/html');

    expect(document.querySelector('.govuk-error-summary')).toBeNull();
    expect(document.body.textContent).not.toContain(commonEn.yourSupportSaveErrorMessage);
  });
});

it('should still display an ordinary draft-save error without a support-save error', () => {
  const html = env.render('steps-to-making-your-claim.njk', {
    ...commonEn,
    i18n: { language: 'en' },
    currentUrl: '/',
    currentHost: 'localhost',
    sections: [],
    updateDraftCaseError: commonEn.updateDraftErrorMessage,
  });
  const document = new DOMParser().parseFromString(html, 'text/html');
  const summaries = document.querySelectorAll('.govuk-error-summary');

  expect(summaries).toHaveLength(1);
  expect(summaries[0].querySelector('li').textContent.trim()).toBe(commonEn.updateDraftErrorMessage);
  expect(document.body.textContent).not.toContain(commonEn.yourSupportSaveErrorMessage);
});
