import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const makingClaimAsLegalRepJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/making-claim-as-legal-representative.json'),
  'utf-8'
);
const makingClaimAsLegalRepJson = JSON.parse(makingClaimAsLegalRepJsonRaw);

const PAGE_URL = '/making-claim-as-legal-representative';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const expectedTitle = makingClaimAsLegalRepJson.title;
const signOutLinkSelector = 'li.govuk-header__navigation-item a.govuk-header__link';

let htmlRes: Document;
describe('Making a claim as a legal representative page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should not display a sign out link as the user is not logged in', () => {
    const signoutLinks = htmlRes.querySelectorAll(signOutLinkSelector);
    expect(signoutLinks.length).equals(0, 'Sign out link should not exist');
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display details with links', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[6].innerHTML).contains(
      makingClaimAsLegalRepJson.p1.start,
      'Could not find the details ' + makingClaimAsLegalRepJson.p1.start
    );
    expect(p1[6].innerHTML).contains(
      makingClaimAsLegalRepJson.p1.link,
      'Could not find the details ' + makingClaimAsLegalRepJson.p1.link
    );
    expect(p1[6].innerHTML).contains(
      makingClaimAsLegalRepJson.p1.end,
      'Could not find the details ' + makingClaimAsLegalRepJson.p1.end
    );
    expect(p1[7].innerHTML).contains(
      makingClaimAsLegalRepJson.p2.start,
      'Could not find the details ' + makingClaimAsLegalRepJson.p2.start
    );
    expect(p1[7].innerHTML).contains(
      makingClaimAsLegalRepJson.p2.link,
      'Could not find the details ' + makingClaimAsLegalRepJson.p2.link
    );
    expect(p1[7].innerHTML).contains(
      makingClaimAsLegalRepJson.p2.end,
      'Could not find the details ' + makingClaimAsLegalRepJson.p2.end
    );
  });
});
