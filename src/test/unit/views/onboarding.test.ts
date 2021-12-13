import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';

import fs from 'fs';
import path from 'path';

const onboardingRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/onboarding.json'), 'utf-8');
const onboardingJSON = JSON.parse(onboardingRaw);

const PAGE_URL = '/';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const expectedTitle = onboardingJSON.h1;
const expectedP1 = onboardingJSON.p1;
const startButtonClass = 'govuk-button govuk-button--start';
const govUkLinkClass = 'govuk-header__link';
const expectedGovUkLink = 'https://www.gov.uk/';
const expectedServiceNameHeader = 'govuk-header__content';
const expectedServiceNameText = 'Employment Tribunals';
const insetClass = 'govuk-inset-text';
const insetText = onboardingJSON.insetText;
const warningClass = 'govuk-warning-text';
const warningText = onboardingJSON.warning;
const p2Text = onboardingJSON.p2;

let htmlRes: Document;
describe('Onboarding page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
  
  it('should display firt paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[0].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should have a link to gov.uk', () => {
    const govHeaderLink = htmlRes.getElementsByClassName(govUkLinkClass);
    expect((govHeaderLink[0] as any).href).contains(expectedGovUkLink, 'Link was not accurate');
  });

  it('should have the correct service name text', () => {
    const serviceNameHeader = htmlRes.getElementsByClassName(expectedServiceNameHeader);
    expect(serviceNameHeader[0].innerHTML).contains(expectedServiceNameText, 'Text was not accurate');
  });

  it('should display button start', () => {
    const button = htmlRes.getElementsByClassName(startButtonClass);
    expect(button[0].innerHTML).contains('Start now', 'Could not find the button');
  });

  it('should display inset text', () => {
    const text = htmlRes.getElementsByClassName(insetClass);
    expect(text[0].innerHTML).contains(insetText, 'Could not find the inset text');
  });

  it('should display warning text', () => {
    const text = htmlRes.getElementsByClassName(warningClass);
    expect(text[0].innerHTML).contains(warningText, 'Could not find the warning text');
  })

  it('should display a second paragraph', () => {
    const p2 = htmlRes.getElementsByClassName(pClass);
    expect(p2[1].innerHTML).contains(p2Text, 'Could not find the p2 text');
  })
});
