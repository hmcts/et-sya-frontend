import { expect } from 'chai';

import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { getHtmlRes } from '../test-helpers/requester';

const PAGE_URL = '/represented-claimant-enter-email';

let htmlRes: Document;

describe('Represented claimant enter email page', () => {
  beforeAll(async () => {
    htmlRes = await getHtmlRes(mockUserCaseComplete, PAGE_URL);
  });

  it('should display the heading marked as optional', () => {
    const heading = htmlRes.getElementsByClassName('govuk-heading-xl');
    expect(heading[0].innerHTML).contains('Claimant’s email address (optional)');
  });

  it('should display the email field label', () => {
    const labels = Array.from(htmlRes.getElementsByTagName('label')).map(l => l.innerHTML.trim());
    expect(labels).to.include('Enter the claimant’s email address');
  });

  it('should no longer display the removed description paragraph', () => {
    const paragraphs = Array.from(htmlRes.getElementsByClassName('govuk-body')).map(p => p.innerHTML);
    expect(paragraphs.some(p => p.includes('process your claim quicker'))).to.be.false;
  });
});
