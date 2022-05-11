import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { StillWorking } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const startDateJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/start-date.json'),
  'utf-8'
);
const startDateJson = JSON.parse(startDateJsonRaw);

const titleClass = 'govuk-heading-xl';
const paragraphClass = 'govuk-body';
const expectedTitle = startDateJson.h1;
const expectedP1WorkingOrNotice = startDateJson.p1.workingOrNotice;
const expectedP1NoLongerWorking = startDateJson.p1.noLongerWorking;
const expectedP2 = startDateJson.p2;
const expectedP3 = startDateJson.p3;
const buttonClass = 'govuk-button';
const inputs = 'govuk-date-input__item';
const expectedInputLabel1 = 'Day';
const expectedInputLabel2 = 'Month';
const expectedInputLabel3 = 'Year';

let htmlRes: Document;
describe('Employment start date page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE || StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PageUrls.START_DATE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display page title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display paragraph 2 text', () => {
    const p2 = htmlRes.getElementsByClassName(paragraphClass);
    expect(p2[0].innerHTML).contains(expectedP2, 'Page title does not exist');
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[0].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[1].innerHTML).contains('Save as draft', 'Could not find the button');
  });

  it('should display 3 input fields', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons.length).equal(3, `only ${radioButtons.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons[0].innerHTML).contains(
      expectedInputLabel1,
      'Could not find the radio button with label ' + expectedInputLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedInputLabel2,
      'Could not find the radio button with label ' + expectedInputLabel2
    );
    expect(radioButtons[2].innerHTML).contains(
      expectedInputLabel3,
      'Could not find the radio button with label ' + expectedInputLabel3
    );
  });
});

describe('Employment start date page - working or notice', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.WORKING || StillWorking.NOTICE,
        },
      })
    )
      .get(PageUrls.START_DATE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display paragraph 1 text', () => {
    const p1WorkingOrNotice = htmlRes.getElementsByClassName(paragraphClass);
    expect(p1WorkingOrNotice[0].innerHTML).contains(expectedP1WorkingOrNotice, 'Page title does not exist');
  });

  it('should display paragraph 3 text', () => {
    const p3 = htmlRes.getElementsByClassName(paragraphClass);
    expect(p3[0].innerHTML).contains(expectedP3, 'Page title does not exist');
  });
});

describe('Employment start date page - no longer working', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          isStillWorking: StillWorking.NO_LONGER_WORKING,
        },
      })
    )
      .get(PageUrls.START_DATE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display paragraph 1 text', () => {
    const p1NoLongerWorking = htmlRes.getElementsByClassName(paragraphClass);
    expect(p1NoLongerWorking[0].innerHTML).contains(expectedP1NoLongerWorking, 'Page title does not exist');
  });
});
