/* eslint-disable jest/no-done-callback */
import { fail } from 'assert';

import { PageUrls } from '../../main/definitions/constants';
import { noSignInRequiredEndpoints } from '../../main/modules/oidc/noSignInRequiredEndpoints';

const pa11y = require('pa11y');

const envUrl = process.env.TEST_URL || 'http://localhost:3001';
const username = process.env.TEST_CASE_USERNAME;
const password = process.env.TEST_CASE_PASSWORD;
const options = ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2'];

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
          'set field #username to ' + username,
          'set field #password to ' + password,
          'click element .button',
          'wait for path to be /steps-to-making-your-claim',
          'navigate to ' + pageUrl,
          'wait for url to be ' + pageUrl,
        ];
      }
      const messages = await pa11y(pageUrl, {
        actions,
        ignore: options,
      });
      expectNoErrors(messages.issues);
    });
  });
}

describe('Accessibility', () => {
  testAccessibility(PageUrls.HOME);
  testAccessibility(PageUrls.CHECKLIST);
  /*
  //Below code needs to be added in future when dev team completed RET-1888 & RET-1889
  Object.values(PageUrls).forEach(url => {
    testAccessibility(url);
  });*/
});
