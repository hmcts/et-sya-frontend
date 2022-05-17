/* eslint-disable jest/no-done-callback */
import { fail } from 'assert';

import * as supertest from 'supertest';

import { app } from '../../main/app';

const config = require('config');
const pa11y = require('pa11y');

const agent = supertest.agent(app);

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

function ensurePageCallWillSucceed(url: string): Promise<void> {
  return agent.get(url).then((res: supertest.Response) => {
    if (res.redirect) {
      throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
    }
    if (res.serverError) {
      throw new Error(`Call to ${url} resulted in internal server error`);
    }
  });
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
      await ensurePageCallWillSucceed(url);
      const frontendUrl: string = config.get('services.frontend.host');
      console.log('.....' + frontendUrl);
      console.log('...etSyaApi..' + config.get('services.etSyaApi.host'));
      const messages = await pa11y('https://et-sya.aat.platform.hmcts.net' + url, options);
      expectNoErrors(messages.issues);
    });
  });
}

describe('Accessibility', () => {
  testAccessibility('/');
  testAccessibility('/checklist');
  testAccessibility('/lip-or-representative');
});
