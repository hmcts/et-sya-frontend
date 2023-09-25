import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const copyToOtherPartyNotSystemUserJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/copy-to-other-party-not-system-user.json'),
  'utf-8'
);

const copyToOtherPartyNotSystemUserJson = JSON.parse(copyToOtherPartyNotSystemUserJsonRaw);

const expectedTitle = copyToOtherPartyNotSystemUserJson.title;
const expectedInset = copyToOtherPartyNotSystemUserJson.theTribunalMustOperate;
const expectedP1 = copyToOtherPartyNotSystemUserJson.toCopyThisCorrespondence;

const insetText = 'govuk-inset-text';
const titleClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const detailsClass = 'govuk-body';
const radios = 'govuk-radios';
const cancelLink = 'govuk-link';

let htmlRes: Document;

describe('Copy to the other party page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display inset text', () => {
    const title = htmlRes.getElementsByClassName(insetText);
    expect(title[0].innerHTML).contains(expectedInset, 'Inset text does not exist');
  });

  it('should display first paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(detailsClass);
    expect(p1[6].innerHTML).contains(expectedP1, 'First paragraph does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });

  it('should display Cancel link', () => {
    const cancel = htmlRes.getElementsByClassName(cancelLink);
    expect(cancel[5].innerHTML).contains('Cancel', 'Could not find the link');
  });
});
