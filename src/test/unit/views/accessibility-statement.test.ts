import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import { PageUrls } from '../../../main/definitions/constants';

const accessibilityStatementJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/accessibility-statement.json'),
  'utf-8'
);
const accessibilityStatementJson = JSON.parse(accessibilityStatementJsonRaw);
const titleTagName = 'title';
const pClass = 'govuk-body';
const listClass = 'govuk-list govuk-list--bullet';
const h1Class = 'govuk-heading-l';
const h2Class = 'govuk-heading-m';
const h3Class = 'govuk-heading-s';
const expectedTitle = accessibilityStatementJson.title;
// PARAGRAPHS
const expectedParagraph_s1_1 = accessibilityStatementJson.paragraph_s1_1;
const expectedParagraph_s1_2 = accessibilityStatementJson.paragraph_s1_2;
const expectedParagraph_s1_3 = accessibilityStatementJson.paragraph_s1_3;
const expectedParagraph_s1_4 = accessibilityStatementJson.paragraph_s1_4;
const expectedParagraph_s2_1 = accessibilityStatementJson.paragraph_s2_1;
const expectedParagraph_s3_1 = accessibilityStatementJson.paragraph_s3_1;
const expectedParagraph_s3_2 = accessibilityStatementJson.paragraph_s3_2;
const expectedParagraph_s3_3 = accessibilityStatementJson.paragraph_s3_3;
const expectedParagraph_s4_1 = accessibilityStatementJson.paragraph_s4_1;
const expectedParagraph_s4_2 = accessibilityStatementJson.paragraph_s4_2;
const expectedParagraph_s5_1 = accessibilityStatementJson.paragraph_s5_1;
const expectedParagraph_s6_1 = accessibilityStatementJson.paragraph_s6_1;
const expectedParagraph_s6_2 = accessibilityStatementJson.paragraph_s6_2;
const expectedParagraph_s6_3 = accessibilityStatementJson.paragraph_s6_3;
const expectedParagraph_s7_1 = accessibilityStatementJson.paragraph_s7_1;
const expectedParagraph_s8_1 = accessibilityStatementJson.paragraph_s8_1;
const expectedParagraph_s9_1 = accessibilityStatementJson.paragraph_s9_1;
const expectedParagraph_s9_2 = accessibilityStatementJson.paragraph_s9_2;
const expectedParagraph_s9_3 = accessibilityStatementJson.paragraph_s9_3;
const expectedParagraph_s9_4 = accessibilityStatementJson.paragraph_s9_4;
const expectedParagraph_s9_5 = accessibilityStatementJson.paragraph_s9_5;
const expectedParagraph_s10_1 = accessibilityStatementJson.paragraph_s10_1;
const expectedParagraph_s11_1 = accessibilityStatementJson.paragraph_s11_1;
const expectedParagraph_s11_2 = accessibilityStatementJson.paragraph_s11_2;
const expectedParagraph_s11_3 = accessibilityStatementJson.paragraph_s11_3;
const expectedParagraph_s11_4 = accessibilityStatementJson.paragraph_s11_4;
const expectedParagraph_s11_5 = accessibilityStatementJson.paragraph_s11_5;
const expectedParagraph_s11_6 = accessibilityStatementJson.paragraph_s11_6;
const expectedParagraph_s11_7 = accessibilityStatementJson.paragraph_s11_7;
const expectedParagraph_s11_8 = accessibilityStatementJson.paragraph_s11_8;
const expectedParagraph_s11_9 = accessibilityStatementJson.paragraph_s11_9;
const expectedHeader1 = accessibilityStatementJson.header1;
const expectedHeader2_1 = accessibilityStatementJson.header2;
const expectedHeader2_2 = accessibilityStatementJson.header3;
const expectedHeader2_3 = accessibilityStatementJson.header4;
const expectedHeader2_4 = accessibilityStatementJson.header5;
const expectedHeader2_5 = accessibilityStatementJson.header6;
const expectedHeader2_6 = accessibilityStatementJson.header7;
const expectedHeader2_7 = accessibilityStatementJson.header8;
const expectedHeader2_8 = accessibilityStatementJson.header9;
const expectedHeader2_9 = accessibilityStatementJson.nonComplianceReason1;
const expectedHeader2_10 = accessibilityStatementJson.nonComplianceReason2;
const expectedHeader2_11 = accessibilityStatementJson.header10;
const expectedHeader2_12 = accessibilityStatementJson.header11;
const expectedHeader3_1 = accessibilityStatementJson.nonComplianceReason2_PDF_DOCS;
const paragraphDoesNotExist = 'Paragraph does not exist';
const h1DoesNotExist = 'Heading 1 does not exist';
const h2DoesNotExist = 'Heading 2 does not exist';
const h3DoesNotExist = 'Heading 3 does not exist';

let htmlRes: Document;
describe('Accessibility statement page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PageUrls.ACCESSIBILITY_STATEMENT)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByTagName(titleTagName);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 31 paragraphs', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p.length).equal(37, `${p.length} paragraphs found - expected 37`);
    expect(p[6].innerHTML).contains(expectedParagraph_s1_1, paragraphDoesNotExist);
    expect(p[7].innerHTML).contains(expectedParagraph_s1_2, paragraphDoesNotExist);
    expect(p[8].innerHTML).contains(expectedParagraph_s1_3, paragraphDoesNotExist);
    expect(p[9].innerHTML).contains(expectedParagraph_s1_4, paragraphDoesNotExist);
    expect(p[10].innerHTML).contains(expectedParagraph_s2_1, paragraphDoesNotExist);
    expect(p[11].innerHTML).contains(expectedParagraph_s3_1, paragraphDoesNotExist);
    expect(p[12].innerHTML).contains(expectedParagraph_s3_2, paragraphDoesNotExist);
    expect(p[13].innerHTML).contains(expectedParagraph_s3_3, paragraphDoesNotExist);
    expect(p[14].innerHTML).contains(expectedParagraph_s4_1, paragraphDoesNotExist);
    expect(p[15].innerHTML).contains(expectedParagraph_s4_2, paragraphDoesNotExist);
    expect(p[16].innerHTML).contains(expectedParagraph_s5_1, paragraphDoesNotExist);
    expect(p[17].innerHTML).contains(expectedParagraph_s6_1, paragraphDoesNotExist);
    expect(p[18].innerHTML).contains(expectedParagraph_s6_2, paragraphDoesNotExist);
    expect(p[19].innerHTML).contains(expectedParagraph_s6_3, paragraphDoesNotExist);
    expect(p[20].innerHTML).contains(expectedParagraph_s7_1, paragraphDoesNotExist);
    expect(p[21].innerHTML).contains(expectedParagraph_s8_1, paragraphDoesNotExist);
    expect(p[22].innerHTML).contains(expectedParagraph_s9_1, paragraphDoesNotExist);
    expect(p[23].innerHTML).contains(expectedParagraph_s9_2, paragraphDoesNotExist);
    expect(p[24].innerHTML).contains(expectedParagraph_s9_3, paragraphDoesNotExist);
    expect(p[25].innerHTML).contains(expectedParagraph_s9_4, paragraphDoesNotExist);
    expect(p[26].innerHTML).contains(expectedParagraph_s9_5, paragraphDoesNotExist);
    expect(p[27].innerHTML).contains(expectedParagraph_s10_1, paragraphDoesNotExist);
    expect(p[28].innerHTML).contains(expectedParagraph_s11_1, paragraphDoesNotExist);
    expect(p[29].innerHTML).contains(expectedParagraph_s11_2, paragraphDoesNotExist);
    expect(p[30].innerHTML).contains(expectedParagraph_s11_3, paragraphDoesNotExist);
    expect(p[31].innerHTML).contains(expectedParagraph_s11_4, paragraphDoesNotExist);
    expect(p[32].innerHTML).contains(expectedParagraph_s11_5, paragraphDoesNotExist);
    expect(p[33].innerHTML).contains(expectedParagraph_s11_6, paragraphDoesNotExist);
    expect(p[34].innerHTML).contains(expectedParagraph_s11_7, paragraphDoesNotExist);
    expect(p[35].innerHTML).contains(expectedParagraph_s11_8, paragraphDoesNotExist);
    expect(p[36].innerHTML).contains(expectedParagraph_s11_9, paragraphDoesNotExist);
  });

  it('should display 5 bullet lists', () => {
    const listItems = htmlRes.getElementsByClassName(listClass);
    expect(listItems.length).equal(5, `${listItems.length} lists found - expected 5`);
  });

  it('should display 1 h1 heading', () => {
    const h1 = htmlRes.getElementsByClassName(h1Class);
    expect(h1.length).equal(1, `${h1.length} h1 headings found - expected 1`);
    expect(h1[0].innerHTML).contains(expectedHeader1, h1DoesNotExist);
  });

  it('should display 12 h2 heading', () => {
    const h2 = htmlRes.getElementsByClassName(h2Class);
    expect(h2.length).equal(14, `${h2.length} h2 headings found - expected 1`);
    expect(h2[2].innerHTML).contains(expectedHeader2_1, h2DoesNotExist);
    expect(h2[3].innerHTML).contains(expectedHeader2_2, h2DoesNotExist);
    expect(h2[4].innerHTML).contains(expectedHeader2_3, h2DoesNotExist);
    expect(h2[5].innerHTML).contains(expectedHeader2_4, h2DoesNotExist);
    expect(h2[6].innerHTML).contains(expectedHeader2_5, h2DoesNotExist);
    expect(h2[7].innerHTML).contains(expectedHeader2_6, h2DoesNotExist);
    expect(h2[8].innerHTML).contains(expectedHeader2_7, h2DoesNotExist);
    expect(h2[9].innerHTML).contains(expectedHeader2_8, h2DoesNotExist);
    expect(h2[10].innerHTML).contains(expectedHeader2_9, h2DoesNotExist);
    expect(h2[11].innerHTML).contains(expectedHeader2_10, h2DoesNotExist);
    expect(h2[12].innerHTML).contains(expectedHeader2_11, h2DoesNotExist);
    expect(h2[13].innerHTML).contains(expectedHeader2_12, h2DoesNotExist);
  });

  it('should display 1 h3 headings', () => {
    const h3 = htmlRes.getElementsByClassName(h3Class);
    expect(h3.length).equal(1, `${h3.length} h3 headings found - expected 6`);
    expect(h3[0].innerHTML).contains(expectedHeader3_1, h3DoesNotExist);
  });
});
