import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockApp } from '../mocks/mockApp';

const applicationCompleteJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/application-complete.json'),
  'utf-8'
);
const applicationCompleteJson = JSON.parse(applicationCompleteJsonRaw);
const titleClass = 'govuk-panel__title';
const panelClass = 'govuk-panel govuk-panel--confirmation';
const pHeader = 'govuk-heading-m';
const buttonClass = 'govuk-button';
const paragraphClass = 'govuk-body';
const expectedTitle = applicationCompleteJson.titleText;
const expectedParagraphNo = applicationCompleteJson.pNo;
const expectedParagraphYes1 = applicationCompleteJson.pYes.p1;
const expectedParagraphYes1a = applicationCompleteJson.pYes.p1a;
const expectedParagraphYes2 = applicationCompleteJson.pYes.p2;
const expectedParagraphYes3 = applicationCompleteJson.pYes.p3;
const applicationDate = new Date();
applicationDate.setDate(applicationDate.getDate() + 7);
const dateString = applicationDate.toLocaleDateString('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const expectedDateString = ' <b>' + dateString + '</b> ';
let htmlRes: Document;

describe('Application complete page - Rule 92 answer Yes', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          rule92state: true,
        },
      })
    )
      .get(PageUrls.APPLICATION_COMPLETE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display GDS panel component', () => {
    const panel = htmlRes.getElementsByClassName(panelClass);
    expect(panel.length).equal(1, 'Single panel component does not exist');
  });

  it('should display panel title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Panel title does not exist');
  });

  it('should display paragraph header', () => {
    const title = htmlRes.getElementsByClassName(pHeader);
    expect(title[2].innerHTML).contains(applicationCompleteJson.pHead, 'Panel title does not exist');
  });

  it('should display three paragraphs', () => {
    const divContainingParagraphs = htmlRes.getElementsByClassName(paragraphClass)[6];
    const paragraphs = divContainingParagraphs.getElementsByTagName('p');
    expect(paragraphs[0].innerHTML).contains(
      expectedParagraphYes1 + expectedDateString + expectedParagraphYes1a,
      'Paragraph 1 does not exist'
    );
    expect(paragraphs[1].innerHTML).contains(expectedParagraphYes2, 'Paragraph 2 does not exist');
    expect(paragraphs[2].innerHTML).contains(expectedParagraphYes3, 'Paragraph 3 does not exist');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[5].innerHTML).contains(applicationCompleteJson.button, 'Could not find the button');
  });
});

describe('Application complete page - Rule 92 answer No', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          rule92state: false,
        },
      })
    )
      .get(PageUrls.APPLICATION_COMPLETE)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display GDS panel component', () => {
    const panel = htmlRes.getElementsByClassName(panelClass);
    expect(panel.length).equal(1, 'Single panel component does not exist');
  });

  it('should display panel title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Panel title does not exist');
  });

  it('should display paragraph header', () => {
    const title = htmlRes.getElementsByClassName(pHeader);
    expect(title[2].innerHTML).contains(applicationCompleteJson.pHead, 'Panel title does not exist');
  });

  it('should display one paragraph', () => {
    const paragraph = htmlRes.getElementsByClassName(paragraphClass);
    expect(paragraph[6].innerHTML).contains(expectedParagraphNo, 'Paragraph does not exist');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[5].innerHTML).contains(applicationCompleteJson.button, 'Could not find the button');
  });
});
