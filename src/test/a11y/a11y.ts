/* eslint-disable jest/no-done-callback */
import { fail } from 'assert';

//import * as supertest from 'supertest';
//import { app } from '../../main/app';
//const agent = supertest.agent(app);
const pa11y = require('pa11y');
const testUrl = process.env.TEST_URL || 'http://localhost:3001';
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
/*
  function isRedirect(url:string) {
  agent.get(url).then((res: supertest.Response) => {
    if (res.redirect) {
      return [
        'set field #username to tester@test.com',
        'set field #password to QATest@2022',
        'click element .button',
        'wait for path to be /steps-to-making-your-claim',
        'navigate to https://et-sya.aat.platform.hmcts.net/notice-pay',
        'wait for url to be https://et-sya.aat.platform.hmcts.net/notice-pay'
      ];
    } else {
      return [];
    }
  });
}*/
function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    it('should have no accessibility errors', async () => {
      console.log('test env is: ' + testUrl);
      //   const actions = await isRedirect(url);
      const messages = await pa11y(testUrl + url, {
        /*actions: [
          'set field #username to tester@test.com',
          'set field #password to QATest@2022',
          'click element .button',
          'wait for path to be /steps-to-making-your-claim',
          'navigate to ' + process.env.TEST_URL + '/notice-pay',
          'wait for url to be ' + process.env.TEST_URL + '/notice-pay',
        ],*/
        options,
      });
      expectNoErrors(messages.issues);
    });
  });
}

describe('Accessibility', () => {
  testAccessibility('/');
  testAccessibility('/checklist');
  //testAccessibility('/lip-or-representative');
  //testAccessibility('/notice-pay');
});
