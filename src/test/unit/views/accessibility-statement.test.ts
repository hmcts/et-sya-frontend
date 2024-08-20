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
const expectedParagraph_s1_1_1 = accessibilityStatementJson.paragraph_s1_1.part_1;
const expectedParagraph_s1_1_2 = accessibilityStatementJson.paragraph_s1_1.part_2;
const expectedParagraph_s1_2 = accessibilityStatementJson.paragraph_s1_2;
const expectedParagraph_s1_3 = accessibilityStatementJson.paragraph_s1_3;
const expectedParagraph_s1_4_1 = accessibilityStatementJson.paragraph_s1_4.part_1;
const expectedParagraph_s1_4_2 = accessibilityStatementJson.paragraph_s1_4.part_2;
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
const expectedParagraph_s8_1_1 = accessibilityStatementJson.paragraph_s8_1.part_1;
const expectedParagraph_s8_1_2 = accessibilityStatementJson.paragraph_s8_1.part_2;
const expectedParagraph_s8_1_3 = accessibilityStatementJson.paragraph_s8_1.part_3;
const expectedParagraph_s9_1 = accessibilityStatementJson.paragraph_s9_1;
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
const expectedHeader2_11 = accessibilityStatementJson.header10;
const expectedHeader2_12 = accessibilityStatementJson.header11;
const expectedNotAccessibile1 = accessibilityStatementJson.notAccessible1;
const expectedNotAccessibile2 = accessibilityStatementJson.notAccessible2;
const expectedNotAccessibile3 = accessibilityStatementJson.notAccessible3;
const expectedNotAccessibile4 = accessibilityStatementJson.notAccessible4;
const expectedNotAccessibile5 = accessibilityStatementJson.notAccessible5;
const expectedNotAccessibile6 = accessibilityStatementJson.notAccessible6;
const expectedAbleTo1 = accessibilityStatementJson.ableTo1;
const expectedAbleTo2 = accessibilityStatementJson.ableTo2;
const expectedAbleTo3 = accessibilityStatementJson.ableTo3;
const expectedAbleTo4 = accessibilityStatementJson.ableTo4;
const expectedAbleTo5 = accessibilityStatementJson.ableTo5;
const expectedContactType1 = accessibilityStatementJson.contactType1;
const expectedNonCompliance_1_1 = accessibilityStatementJson.nonCompliance_1_1;
const expectedNonCompliance_1_2 = accessibilityStatementJson.nonCompliance_1_2;
const expectedNonCompliance_1_3 = accessibilityStatementJson.nonCompliance_1_3;
const expectedNonCompliance_1_4 = accessibilityStatementJson.nonCompliance_1_4;
const expectedNonCompliance_1_5 = accessibilityStatementJson.nonCompliance_1_5;
const expectedNonCompliance_1_6 = accessibilityStatementJson.nonCompliance_1_6;
const expectedNonCompliance_1_7 = accessibilityStatementJson.nonCompliance_1_7;
const paragraphDoesNotExist = 'Paragraph does not exist';
const h1DoesNotExist = 'Heading 1 does not exist';
const h2DoesNotExist = 'Heading 2 does not exist';
const bulletPointDoesNotExist = 'Bullet point does not exist';
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

  it('should 23 display paragraphs', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p.length).equal(23, `${p.length} paragraphs found - expected 23`);
    expect(p[6].innerHTML).contains(expectedParagraph_s1_1_1, paragraphDoesNotExist);
    expect(p[6].innerHTML).contains(expectedParagraph_s1_1_2, paragraphDoesNotExist);
    expect(p[7].innerHTML).contains(expectedParagraph_s1_2, paragraphDoesNotExist);
    expect(p[8].innerHTML).contains(expectedParagraph_s1_3, paragraphDoesNotExist);
    expect(p[9].innerHTML).contains(expectedParagraph_s1_4_1, paragraphDoesNotExist);
    expect(p[9].innerHTML).contains(expectedParagraph_s1_4_2, paragraphDoesNotExist);
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
    expect(p[21].innerHTML).contains(expectedParagraph_s8_1_1, paragraphDoesNotExist);
    expect(p[21].innerHTML).contains(expectedParagraph_s8_1_2, paragraphDoesNotExist);
    expect(p[21].innerHTML).contains(expectedParagraph_s8_1_3, paragraphDoesNotExist);
    expect(p[22].innerHTML).contains(expectedParagraph_s9_1, paragraphDoesNotExist);
  });

  it('should display 7 bullet lists', () => {
    const listItems = htmlRes.getElementsByClassName(listClass);
    expect(listItems.length).equal(7, `${listItems.length} lists found - expected 7`);
    expect(listItems[0].innerHTML).contains(expectedAbleTo1, bulletPointDoesNotExist);
    expect(listItems[0].innerHTML).contains(expectedAbleTo2, bulletPointDoesNotExist);
    expect(listItems[0].innerHTML).contains(expectedAbleTo3, bulletPointDoesNotExist);
    expect(listItems[0].innerHTML).contains(expectedAbleTo4, bulletPointDoesNotExist);
    expect(listItems[0].innerHTML).contains(expectedAbleTo5, bulletPointDoesNotExist);
    expect(listItems[1].innerHTML).contains(expectedNotAccessibile1, bulletPointDoesNotExist);
    expect(listItems[1].innerHTML).contains(expectedNotAccessibile2, bulletPointDoesNotExist);
    expect(listItems[1].innerHTML).contains(expectedNotAccessibile3, bulletPointDoesNotExist);
    expect(listItems[1].innerHTML).contains(expectedNotAccessibile4, bulletPointDoesNotExist);
    expect(listItems[1].innerHTML).contains(expectedNotAccessibile5, bulletPointDoesNotExist);
    expect(listItems[1].innerHTML).contains(expectedNotAccessibile6, bulletPointDoesNotExist);
    expect(listItems[2].innerHTML).contains(expectedContactType1, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_1, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_2, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_3, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_4, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_5, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_6, bulletPointDoesNotExist);
    expect(listItems[4].innerHTML).contains(expectedNonCompliance_1_7, bulletPointDoesNotExist);
  });

  it('should display 1 h1 heading', () => {
    const h1 = htmlRes.getElementsByClassName(h1Class);
    expect(h1.length).equal(1, `${h1.length} h1 headings found - expected 1`);
    expect(h1[0].innerHTML).contains(expectedHeader1, h1DoesNotExist);
  });

  it('should display 12 h2 heading', () => {
    const h2 = htmlRes.getElementsByClassName(h2Class);
    expect(h2.length).equal(12, `${h2.length} h2 headings found - expected 12`);
    expect(h2[2].innerHTML).contains(expectedHeader2_1, h2DoesNotExist);
    expect(h2[3].innerHTML).contains(expectedHeader2_2, h2DoesNotExist);
    expect(h2[4].innerHTML).contains(expectedHeader2_3, h2DoesNotExist);
    expect(h2[5].innerHTML).contains(expectedHeader2_4, h2DoesNotExist);
    expect(h2[6].innerHTML).contains(expectedHeader2_5, h2DoesNotExist);
    expect(h2[7].innerHTML).contains(expectedHeader2_6, h2DoesNotExist);
    expect(h2[8].innerHTML).contains(expectedHeader2_7, h2DoesNotExist);
    expect(h2[9].innerHTML).contains(expectedHeader2_8, h2DoesNotExist);
    expect(h2[10].innerHTML).contains(expectedHeader2_11, h2DoesNotExist);
    expect(h2[11].innerHTML).contains(expectedHeader2_12, h2DoesNotExist);
  });

  it('should display 1 h3 heading', () => {
    const h3 = htmlRes.getElementsByClassName(h3Class);
    expect(h3.length).equal(1, `${h3.length} h3 headings found - expected 1`);
    expect(h3[0].innerHTML).contains(expectedHeader2_9, h2DoesNotExist);
  });
});
