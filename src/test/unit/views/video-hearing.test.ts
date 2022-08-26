import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const videoHearingJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/video-hearings.json'),
  'utf-8'
);
const videoHearingJson = JSON.parse(videoHearingJsonRaw);
const PAGE_URL = PageUrls.VIDEO_HEARINGS;

const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const expectedTitle = videoHearingJson.h1;
const expectedP1 = videoHearingJson.p1;
const buttonClass = 'govuk-button';
const checkboxClass = 'govuk-checkboxes__input';
const checkboxLabel = 'govuk-checkboxes__label';
const expectedLabel1 = videoHearingJson.checkboxVideo;
const expectedLabel2 = videoHearingJson.checkboxPhone;
const expectedLabel3 = videoHearingJson.checkboxNeither;

let htmlRes: Document;
describe('Hearing Preference video or phone Choice page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display firt paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[5].innerHTML).contains(expectedP1, 'P1 does not exist');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('continue', 'Could not find the button');
  });

  it('should display 3 checkboxes', () => {
    const checkboxes = htmlRes.getElementsByClassName(checkboxClass);
    expect(checkboxes.length).equal(3, '3 checkboxes not found');
  });

  it('should display checkboxes with valid text', () => {
    const checkboxes = htmlRes.getElementsByClassName(checkboxLabel);
    expect(checkboxes[0].innerHTML).contains(
      expectedLabel1,
      'Could not find the checkbox with label ' + expectedLabel1
    );
    expect(checkboxes[1].innerHTML).contains(
      expectedLabel2,
      'Could not find the checkbox with label ' + expectedLabel2
    );
    expect(checkboxes[2].innerHTML).contains(
      expectedLabel3,
      'Could not find the checkbox with label ' + expectedLabel3
    );
  });
});
