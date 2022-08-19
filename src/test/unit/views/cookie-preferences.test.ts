import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const cookiePreferencesJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/cookie-preferences.json'),
  'utf-8'
);
const cookiePreferencesJson = JSON.parse(cookiePreferencesJsonRaw);
const titleClass = 'govuk-heading-l';
const pClass = 'govuk-body';
const listClass = 'govuk-list govuk-list--bullet';
const h2Class = 'govuk-heading-m';
const h3Class = 'govuk-heading-s';
const tableClass = 'govuk-table';
const tableHeaderClass = 'govuk-table__header';
const tableCellClass = 'govuk-table__cell';
const inputs = 'govuk-radios';
const buttonClass = 'govuk-button';
const expectedTitle = cookiePreferencesJson.title;
const expectedParagraph1 = cookiePreferencesJson.paragraph1;
const expectedHowAreCookiesUsedParagraph1 = cookiePreferencesJson.howAreCookiesUsedParagraph1;
const expectedHowAreCookiesUsedParagraph2 = cookiePreferencesJson.howAreCookiesUsedParagraph2;
const expectedHowAreCookiesUsedHeading2 = cookiePreferencesJson.howAreCookiesUsedHeading2;
const expectedWebsiteUsageCookiesHeading3 = cookiePreferencesJson.websiteUsageCookiesHeading3;
const expectedWebsiteUsageCookiesParagraph1 = cookiePreferencesJson.websiteUsageCookiesParagraph1;
const expectedWebsiteUsageCookiesParagraph2 = cookiePreferencesJson.websiteUsageCookiesParagraph2;
const expectedWebsiteUsageCookiesParagraph3 = cookiePreferencesJson.websiteUsageCookiesParagraph3;
const expectedWebsiteUsageCookiesParagraph4 = cookiePreferencesJson.websiteUsageCookiesParagraph4;
const expectedWebsiteUsageCookiesParagraph5 = cookiePreferencesJson.websiteUsageCookiesParagraph5;
const expectedCookieNameHeader = cookiePreferencesJson.cookieNameHeader;
const expectedCookiePurposeHeader = cookiePreferencesJson.cookiePurposeHeader;
const expectedCookieExpiryHeader = cookiePreferencesJson.cookieExpiryHeader;
const expectedGoogleAnalyticsCookieName1 = cookiePreferencesJson.googleAnalyticsCookieName1;
const expectedGoogleAnalyticsCookiePurpose1 = cookiePreferencesJson.googleAnalyticsCookiePurpose1;
const expectedGoogleAnalyticsCookieExpiry1 = cookiePreferencesJson.googleAnalyticsCookieExpiry1;
const expectedGoogleAnalyticsCookieName2 = cookiePreferencesJson.googleAnalyticsCookieName2;
const expectedGoogleAnalyticsCookiePurpose2 = cookiePreferencesJson.googleAnalyticsCookiePurpose2;
const expectedGoogleAnalyticsCookieExpiry2 = cookiePreferencesJson.googleAnalyticsCookieExpiry2;
const expectedGoogleAnalyticsCookieName3 = cookiePreferencesJson.googleAnalyticsCookieName3;
const expectedGoogleAnalyticsCookiePurpose3 = cookiePreferencesJson.googleAnalyticsCookiePurpose3;
const expectedGoogleAnalyticsCookieExpiry3 = cookiePreferencesJson.googleAnalyticsCookieExpiry3;
const expectedIntroMessageCookiesHeading1 = cookiePreferencesJson.introMessageCookiesHeading1;
const expectedIntroMessageCookiesParagraph1 = cookiePreferencesJson.introMessageCookiesParagraph1;
const expectedIntroMessageCookieName1 = cookiePreferencesJson.introMessageCookieName1;
const expectedIntroMessageCookiePurpose1 = cookiePreferencesJson.introMessageCookiePurpose1;
const expectedIntroMessageCookieExpiry1 = cookiePreferencesJson.introMessageCookieExpiry1;
const expectedSessionCookiesHeading1 = 'To store the answers you’ve given during your visit (known as a ‘session’)';
const expectedSessionCookiesParagraph1 = cookiePreferencesJson.sessionCookiesParagraph1;
const expectedSessionCookieName1 = cookiePreferencesJson.sessionCookieName1;
const expectedSessionCookiePurpose1 = cookiePreferencesJson.sessionCookiePurpose1;
const expectedIdentityCookiesHeading1 = cookiePreferencesJson.identityCookiesHeading1;
const expectedIdentityCookiesParagraph1 = cookiePreferencesJson.identityCookiesParagraph1;
const expectedIdentityCookieName1 = cookiePreferencesJson.identityCookieName1;
const expectedIdentityCookiePurpose1 = cookiePreferencesJson.identityCookiePurpose1;
const expectedSecurityCookiesHeading1 = cookiePreferencesJson.securityCookiesHeading1;
const expectedSecurityCookiesParagraph1 = cookiePreferencesJson.securityCookiesParagraph1;
const expectedSecurityCookieName1 = cookiePreferencesJson.securityCookieName1;
const expectedSecurityCookiePurpose1 = cookiePreferencesJson.securityCookiePurpose1;
const expectedSecurityCookieName2 = cookiePreferencesJson.securityCookieName2;
const expectedSecurityCookiePurpose2 = cookiePreferencesJson.securityCookiePurpose2;
const expectedDynatraceCookiesHeading1 = cookiePreferencesJson.dynatraceCookiesHeading1;
const expectedDynatraceCookiesParagraph1 = cookiePreferencesJson.dynatraceCookiesParagraph1;
const expectedDynatraceCookiesParagraph2 =
  'Information is presented within the Application Performance Monitoring service for the purposes detailed above. We do not use or share the information for any other purpose. We do not allow Dynatrace to use or share the information for any other purposes.';
const expectedDynatraceCookiesPurpose1 = cookiePreferencesJson.dynatraceCookiesPurpose1;
const expectedDynatraceCookiesPurpose2 = cookiePreferencesJson.dynatraceCookiesPurpose2;
const expectedDynatraceCookiesPurpose3 = cookiePreferencesJson.dynatraceCookiesPurpose3;
const expectedDynatraceCookiesPurpose4 = cookiePreferencesJson.dynatraceCookiesPurpose4;
const expectedDynatraceCookiesPurpose5 = cookiePreferencesJson.dynatraceCookiesPurpose5;
const expectedDynatraceCookiesPurpose6 = cookiePreferencesJson.dynatraceCookiesPurpose6;
const expectedDynatraceCookieName1 = cookiePreferencesJson.dynatraceCookieName1;
const expectedDynatraceCookieName2 = cookiePreferencesJson.dynatraceCookieName2;
const expectedDynatraceCookieName3 = cookiePreferencesJson.dynatraceCookieName3;
const expectedDynatraceCookieName4 = cookiePreferencesJson.dynatraceCookieName4;
const expectedDynatraceCookieName5 = cookiePreferencesJson.dynatraceCookieName5;
const expectedDynatraceCookieName6 = cookiePreferencesJson.dynatraceCookieName6;
const expectedSessionEnd = cookiePreferencesJson.sessionEnd;
const expectedWhenYouCloseYourBrowser = cookiePreferencesJson.whenYouCloseYourBrowser;
const expectedOneYear = cookiePreferencesJson.oneYear;
const expectedSave = cookiePreferencesJson.save;
const paragraphDoesNotExist = 'Paragraph does not exist';
const h2DoesNotExist = 'Heading 2 does not exist';
const h3DoesNotExist = 'Heading 3 does not exist';
const tableHeaderDoesNotExist = 'Table header does not exist';
const tableCellDoesNotExist = 'Table cell does not exist';

let htmlRes: Document;
describe('Cookie preferences page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.COOKIE_PREFERENCES)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 18 paragraphs', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p.length).equal(18, `${p.length} paragraphs found - expected 18`);
    expect(p[4].innerHTML).contains(expectedParagraph1, paragraphDoesNotExist);
    expect(p[5].innerHTML).contains(expectedHowAreCookiesUsedParagraph1, paragraphDoesNotExist);
    expect(p[6].innerHTML).contains(expectedHowAreCookiesUsedParagraph2, paragraphDoesNotExist);
    expect(p[7].innerHTML).contains(expectedWebsiteUsageCookiesParagraph1, paragraphDoesNotExist);
    expect(p[8].innerHTML).contains(expectedWebsiteUsageCookiesParagraph2, paragraphDoesNotExist);
    expect(p[9].innerHTML).contains(expectedWebsiteUsageCookiesParagraph3, paragraphDoesNotExist);
    expect(p[10].innerHTML).contains(expectedWebsiteUsageCookiesParagraph4, paragraphDoesNotExist);
    expect(p[11].innerHTML).contains(expectedWebsiteUsageCookiesParagraph5, paragraphDoesNotExist);
    expect(p[12].innerHTML).contains(expectedIntroMessageCookiesParagraph1, paragraphDoesNotExist);
    expect(p[13].innerHTML).contains(expectedSessionCookiesParagraph1, paragraphDoesNotExist);
    expect(p[14].innerHTML).contains(expectedIdentityCookiesParagraph1, paragraphDoesNotExist);
    expect(p[15].innerHTML).contains(expectedSecurityCookiesParagraph1, paragraphDoesNotExist);
    expect(p[16].innerHTML).contains(expectedDynatraceCookiesParagraph1, paragraphDoesNotExist);
    expect(p[17].innerHTML).contains(expectedDynatraceCookiesParagraph2, paragraphDoesNotExist);
  });

  it('should display 3 bullet lists', () => {
    const listItems = htmlRes.getElementsByClassName(listClass);
    expect(listItems.length).equal(3, `${listItems.length} lists found - expected 3`);
  });

  it('should display 1 h2 heading excluding banner', () => {
    const h2 = htmlRes.getElementsByClassName(h2Class);
    expect(h2.length).equal(2, `${h2.length} h2 headings found - expected 2`);
    expect(h2[1].innerHTML).contains(expectedHowAreCookiesUsedHeading2, h2DoesNotExist);
  });

  it('should display 6 h3 headings', () => {
    const h3 = htmlRes.getElementsByClassName(h3Class);
    expect(h3.length).equal(6, `${h3.length} h3 headings found - expected 6`);
    expect(h3[0].innerHTML).contains(expectedWebsiteUsageCookiesHeading3, h3DoesNotExist);
    expect(h3[1].innerHTML).contains(expectedIntroMessageCookiesHeading1, h3DoesNotExist);
    expect(h3[2].innerHTML).contains(expectedSessionCookiesHeading1, h3DoesNotExist);
    expect(h3[3].innerHTML).contains(expectedIdentityCookiesHeading1, h3DoesNotExist);
    expect(h3[4].innerHTML).contains(expectedSecurityCookiesHeading1, h3DoesNotExist);
    expect(h3[5].innerHTML).contains(expectedDynatraceCookiesHeading1, h3DoesNotExist);
  });

  it('should display 6 tables with 3 headers each', () => {
    const tables = htmlRes.getElementsByClassName(tableClass);
    const headers = htmlRes.getElementsByClassName(tableHeaderClass);
    expect(tables.length).equal(6, `${tables.length} tables found. Expected 6`);
    expect(headers.length).equal(18, `${headers.length} table headers found. Expected 18`);
    for (let i = 0; i <= 9; i += 3) {
      expect(headers[i].innerHTML).contains(expectedCookieNameHeader, tableHeaderDoesNotExist);
    }
    for (let i = 1; i <= 10; i += 3) {
      expect(headers[i].innerHTML).contains(expectedCookiePurposeHeader, tableHeaderDoesNotExist);
    }
    for (let i = 2; i <= 11; i += 3) {
      expect(headers[i].innerHTML).contains(expectedCookieExpiryHeader, tableHeaderDoesNotExist);
    }
  });

  it('should display website usage cookies table', () => {
    const cells = htmlRes.getElementsByClassName(tableCellClass);
    expect(cells[0].innerHTML).contains(expectedGoogleAnalyticsCookieName1, tableCellDoesNotExist);
    expect(cells[1].innerHTML).contains(expectedGoogleAnalyticsCookiePurpose1, tableCellDoesNotExist);
    expect(cells[2].innerHTML).contains(expectedGoogleAnalyticsCookieExpiry1, tableCellDoesNotExist);
    expect(cells[3].innerHTML).contains(expectedGoogleAnalyticsCookieName2, tableCellDoesNotExist);
    expect(cells[4].innerHTML).contains(expectedGoogleAnalyticsCookiePurpose2, tableCellDoesNotExist);
    expect(cells[5].innerHTML).contains(expectedGoogleAnalyticsCookieExpiry2, tableCellDoesNotExist);
    expect(cells[6].innerHTML).contains(expectedGoogleAnalyticsCookieName3, tableCellDoesNotExist);
    expect(cells[7].innerHTML).contains(expectedGoogleAnalyticsCookiePurpose3, tableCellDoesNotExist);
    expect(cells[8].innerHTML).contains(expectedGoogleAnalyticsCookieExpiry3, tableCellDoesNotExist);
  });

  it('should display intro message cookies table', () => {
    const cells = htmlRes.getElementsByClassName(tableCellClass);
    expect(cells[9].innerHTML).contains(expectedIntroMessageCookieName1, tableCellDoesNotExist);
    expect(cells[10].innerHTML).contains(expectedIntroMessageCookiePurpose1, tableCellDoesNotExist);
    expect(cells[11].innerHTML).contains(expectedIntroMessageCookieExpiry1, tableCellDoesNotExist);
  });

  it('should display session cookies table', () => {
    const cells = htmlRes.getElementsByClassName(tableCellClass);
    expect(cells[12].innerHTML).contains(expectedSessionCookieName1, tableCellDoesNotExist);
    expect(cells[13].innerHTML).contains(expectedSessionCookiePurpose1, tableCellDoesNotExist);
    expect(cells[14].innerHTML).contains(expectedWhenYouCloseYourBrowser, tableCellDoesNotExist);
  });

  it('should display identity cookies table', () => {
    const cells = htmlRes.getElementsByClassName(tableCellClass);
    expect(cells[15].innerHTML).contains(expectedIdentityCookieName1, tableCellDoesNotExist);
    expect(cells[16].innerHTML).contains(expectedIdentityCookiePurpose1, tableCellDoesNotExist);
    expect(cells[17].innerHTML).contains(expectedWhenYouCloseYourBrowser, tableCellDoesNotExist);
  });

  it('should display security cookies table', () => {
    const cells = htmlRes.getElementsByClassName(tableCellClass);
    expect(cells[18].innerHTML).contains(expectedSecurityCookieName1, tableCellDoesNotExist);
    expect(cells[19].innerHTML).contains(expectedSecurityCookiePurpose1, tableCellDoesNotExist);
    expect(cells[20].innerHTML).contains(expectedWhenYouCloseYourBrowser, tableCellDoesNotExist);
    expect(cells[21].innerHTML).contains(expectedSecurityCookieName2, tableCellDoesNotExist);
    expect(cells[22].innerHTML).contains(expectedSecurityCookiePurpose2, tableCellDoesNotExist);
    expect(cells[23].innerHTML).contains(expectedWhenYouCloseYourBrowser, tableCellDoesNotExist);
  });

  it('should display dynatrace cookies table', () => {
    const cells = htmlRes.getElementsByClassName(tableCellClass);
    expect(cells[24].innerHTML).contains(expectedDynatraceCookieName1, tableCellDoesNotExist);
    expect(cells[25].innerHTML).contains(expectedDynatraceCookiesPurpose1, tableCellDoesNotExist);
    expect(cells[26].innerHTML).contains(expectedSessionEnd, tableCellDoesNotExist);
    expect(cells[27].innerHTML).contains(expectedDynatraceCookieName2, tableCellDoesNotExist);
    expect(cells[28].innerHTML).contains(expectedDynatraceCookiesPurpose2, tableCellDoesNotExist);
    expect(cells[29].innerHTML).contains(expectedSessionEnd, tableCellDoesNotExist);
    expect(cells[30].innerHTML).contains(expectedDynatraceCookieName3, tableCellDoesNotExist);
    expect(cells[31].innerHTML).contains(expectedDynatraceCookiesPurpose3, tableCellDoesNotExist);
    expect(cells[32].innerHTML).contains(expectedSessionEnd, tableCellDoesNotExist);
    expect(cells[33].innerHTML).contains(expectedDynatraceCookieName4, tableCellDoesNotExist);
    expect(cells[34].innerHTML).contains(expectedDynatraceCookiesPurpose4, tableCellDoesNotExist);
    expect(cells[35].innerHTML).contains(expectedSessionEnd, tableCellDoesNotExist);
    expect(cells[36].innerHTML).contains(expectedDynatraceCookieName5, tableCellDoesNotExist);
    expect(cells[37].innerHTML).contains(expectedDynatraceCookiesPurpose5, tableCellDoesNotExist);
    expect(cells[38].innerHTML).contains(expectedOneYear, tableCellDoesNotExist);
    expect(cells[39].innerHTML).contains(expectedDynatraceCookieName6, tableCellDoesNotExist);
    expect(cells[40].innerHTML).contains(expectedDynatraceCookiesPurpose6, tableCellDoesNotExist);
    expect(cells[41].innerHTML).contains(expectedSessionEnd, tableCellDoesNotExist);
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(inputs);
    expect(radioButtons.length).equal(2, `${radioButtons.length} found. Expected 4`);
  });

  it('should display save button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[4].innerHTML).contains(expectedSave, 'Could not find the button');
  });
});
