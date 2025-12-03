import { expect } from 'chai';
import request from 'supertest';

import pageJson from '../../../main/resources/locales/en/translation/claim-submitted.json';
import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/your-claim-has-been-submitted';
const expectedTitle = 'Your claim has been submitted';
const panelClass = 'govuk-panel';
const panelTitleClass = 'govuk-panel__title';
const summaryListClass = 'govuk-summary-list';
const headingMClass = 'govuk-heading-m';
const listClass = 'govuk-list';
const bodyClass = 'govuk-body';
const linkClass = 'govuk-link';

let htmlRes: Document;
let headings: HTMLCollectionOf<Element>;
let summaryLists: HTMLCollectionOf<Element>;
let lists: HTMLCollectionOf<Element>;
let bodyElements: HTMLCollectionOf<Element>;

describe('Claim Submitted Confirmation page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          et1SubmittedForm: {
            id: '1010101',
            description: 'ET1Form_Joe_Bloggs.pdf',
            type: 'ET1Form_Joe_Bloggs.com',
          },
          claimSummaryFile: {
            document_filename: 'describe.pdf',
            document_url: 'describe.com',
            document_binary_url: '034034034',
            document_size: 16,
            document_mime_type: 'text',
          },
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        headings = htmlRes.getElementsByClassName(headingMClass);
        summaryLists = htmlRes.getElementsByClassName(summaryListClass);
        lists = htmlRes.getElementsByClassName(listClass);
        bodyElements = htmlRes.getElementsByClassName(bodyClass);
      });
  });

  it('should display one GDS panel component', () => {
    const p = htmlRes.getElementsByClassName(panelClass);
    expect(p.length).equal(1, 'A panel component does not exist');
  });

  it('should display the title within the gds panel component', () => {
    const title = htmlRes.getElementsByClassName(panelTitleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  describe('What happens next', () => {
    it('should display title', () => {
      expect(getTrimmedInnerText(headings[2])).equals(pageJson.whatHappensNext);
    });

    it('should contain correct bullet points', () => {
      expect(lists[0].children).length(2);
      expect(getLiTextFromUl(lists[0], 0)).equals(pageJson.whatHappensNextItemOne);
      expect(getLiTextFromUl(lists[0], 1)).equals(pageJson.whatHappensNextItemTwo);
    });
  });

  describe('Submission details', () => {
    it('should display title', () => {
      expect(getTrimmedInnerText(headings[3])).equals(pageJson.submissionDetails);
    });

    it('should have 4 items', () => {
      expect(summaryLists[0].children).length(4, 'Expected 4 items in submission details summary list');

      expect(getKeyFromSummaryList(summaryLists[0], 0)).equals(pageJson.submissionReference);
      expect(getKeyFromSummaryList(summaryLists[0], 1)).equals(pageJson.claimSubmitted);
      expect(getKeyFromSummaryList(summaryLists[0], 2)).equals(pageJson.downloadClaim);
      expect(getKeyFromSummaryList(summaryLists[0], 3)).equals(pageJson.attachments);
    });
    it('should display the file name', () => {
      expect(summaryLists[0].children[3].innerHTML).contains('describe.pdf');
    });
  });

  describe('Tribunal details', () => {
    it('should display title', () => {
      expect(getTrimmedInnerText(headings[4])).equals(pageJson.claimQuestions);
    });

    it('should display download claim subtext', () => {
      expect(getTrimmedInnerText(bodyElements[7])).equals(pageJson.downloadClaimHint);
    });

    it('should display subtext', () => {
      expect(getTrimmedInnerText(bodyElements[8])).equals(pageJson.claimQuestionsText);
    });

    it('should display subtext call ET customer care', () => {
      expect(getTrimmedInnerText(bodyElements[9])).equals(pageJson.processQuestionsText);
    });

    it('should have 3 items', () => {
      expect(summaryLists[1].children).length(3, 'Expected 3 items in tribunal details summary list');

      expect(getKeyFromSummaryList(summaryLists[1], 0)).equals(pageJson.tribunalOffice);
      expect(getKeyFromSummaryList(summaryLists[1], 1)).equals(pageJson.email);
      expect(getKeyFromSummaryList(summaryLists[1], 2)).equals(pageJson.telephone);
    });
  });

  describe('Further questions', () => {
    it('should display title', () => {
      expect(getTrimmedInnerText(headings[5])).equals(pageJson.processQuestions);
    });

    it('should contain correct list items', () => {
      expect(lists[1].children).length(3);
      expect(getLiTextFromUl(lists[1], 0)).equals(pageJson.contactPrimary);
      expect(getLiTextFromUl(lists[1], 1)).equals(pageJson.contactWelsh);
      expect(getLiTextFromUl(lists[1], 2)).equals(pageJson.contactScotland);
    });

    it('should display append', () => {
      expect(getTrimmedInnerText(bodyElements[10])).equals(pageJson.contactAppend);
    });
  });

  describe('Improve box', () => {
    let blackBox: HTMLCollectionOf<Element>;

    beforeAll(() => {
      blackBox = htmlRes.getElementsByClassName('black-border');
    });

    it('should have a black box', () => {
      expect(blackBox[0].children.length).greaterThanOrEqual(1);
    });

    it('should have correct heading', () => {
      const element = blackBox[0].children[0];

      expect(element.classList[0]).equals(headingMClass);
      expect(element.innerHTML.trim()).equal(pageJson.survey.titleText);
    });

    it('should have correct text', () => {
      const element = blackBox[0].children[1];

      expect(element.classList[0]).equals(bodyClass);
      expect(element.innerHTML.trim()).equal(pageJson.survey.text.replace(/&/g, '&amp;'));
    });

    it('should have "Complete this short survey" link', () => {
      const paragraph = blackBox[0].children[1];
      const link = paragraph.querySelector('a');

      expect(link).to.not.be.null;
      expect(link?.classList.contains(linkClass)).to.be.true;
    });
  });
});

function getLiTextFromUl(ul: Element, index: number) {
  return ul?.children?.[index]?.innerHTML.trim();
}

function getKeyFromSummaryList(summaryList: Element, index: number) {
  return summaryList?.children[index]?.children[0]?.innerHTML.trim();
}

function getTrimmedInnerText(element: Element) {
  return element.innerHTML.trim();
}
