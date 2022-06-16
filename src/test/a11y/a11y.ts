/* eslint-disable jest/no-done-callback */
import { fail } from 'assert';

import { PageUrls } from '../../main/definitions/constants';
import { noSignInRequiredEndpoints } from '../../main/modules/oidc/noSignInRequiredEndpoints';

const pa11y = require('pa11y');

const envUrl = process.env.TEST_URL || 'http://localhost:3001';
const data = require('../../test/functional/data.json');

const options = {
  ignore: [
    'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Fieldset.Name',
    'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Select.Name',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.H71.NoLegend',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.F68',
    'WCAG2AA.Principle3.Guideline3_2.3_2_2.H32.2',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.HeadersRequired',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2',
  ],
  hideElements: '.govuk-header, .govuk-footer, link[rel=mask-icon], #ctsc-web-chat, iframe, #app-cookie-banner',
};

class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    it('should have no accessibility errors', async () => {
      let actions: string[] = [];
      const pageUrl = envUrl + url;
      if (!noSignInRequiredEndpoints.includes(url)) {
        actions = [
          'set field #username to ' + data.signIn.username,
          'set field #password to ' + data.signIn.password,
          'click element .button',
          'wait for path to be /steps-to-making-your-claim',
          'navigate to ' + pageUrl,
          'wait for url to be ' + pageUrl,
        ];
      }
      const messages = await pa11y(pageUrl, {
        actions,
        options,
      });
      expectNoErrors(messages.issues);
    });
  });
}

describe('Accessibility', () => {
  //Below code needs to be added in future when dev team completed RET-1888 & RET-1889
  Object.values(PageUrls).forEach(url => {
    testAccessibility(url);
  });
});
