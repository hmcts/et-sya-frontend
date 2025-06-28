import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { getHtmlRes } from '../test-helpers/requester';

const changeLegalRepresentativeJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/change-legal-representative.json'),
  'utf-8'
);
const changeLegalRepresentativeJson = JSON.parse(changeLegalRepresentativeJsonRaw);
const PAGE_URL = '/change-legal-representative';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = changeLegalRepresentativeJson.pageTitle;
const expectedP1 = changeLegalRepresentativeJson.p1;
const expectedP2 = changeLegalRepresentativeJson.p2;
const expectedButton = changeLegalRepresentativeJson.returnToCaseOverview;

const EXPECTED_TITLE = 'Changing legal representative';
const FIRST_PARAGRAPH =
  'If you are currently legally represented and you wish to change your legal representative or become unrepresented then you should contact your legal representative.';
const SECOND_PARAGRAPH =
  'If you cannot do that then you should <a href="contact-the-tribunal/other">contact the tribunal</a>.';
const BUTTON_TEXT = 'Return to case overview';

let htmlRes: Document;
describe('Change legal representative page', () => {
  beforeAll(async () => {
    htmlRes = await getHtmlRes(mockUserCaseComplete, PAGE_URL);
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, EXPECTED_TITLE);
  });

  it('should display first paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[6].innerHTML).contains(expectedP1, FIRST_PARAGRAPH);
  });

  it('should display second paragraph', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[7].innerHTML).contains(expectedP2, SECOND_PARAGRAPH);
  });

  it('should display start now button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(expectedButton, BUTTON_TEXT);
  });
});
