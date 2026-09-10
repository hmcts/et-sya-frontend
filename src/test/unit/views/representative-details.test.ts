import { expect } from 'chai';

import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { getHtmlRes } from '../test-helpers/requester';

const PAGE_URL = '/representative-details';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const buttonClass = 'govuk-button';
const expectedTitle = "Representative's details";
const expectedP1 = 'All correspondence about the case will be sent to the representative and not the claimant.';
const expectedDropdownLabel = 'Type of representative';
const expectedOrgNameLabel = "Name of the representative's organisation (optional)";
const expectedRepNameLabel = "Representative's name";

let htmlRes: Document;

describe("Representative's details page", () => {
  beforeAll(async () => {
    htmlRes = await getHtmlRes(mockUserCaseComplete, PAGE_URL);
  });

  it('should display the page title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display the first paragraph', () => {
    const paragraphs = htmlRes.getElementsByClassName(pClass);
    const found = Array.from(paragraphs).some(p => p.innerHTML.includes(expectedP1));
    expect(found).to.be.true;
  });

  it('should display the type of representative dropdown', () => {
    const labels = htmlRes.getElementsByTagName('label');
    const found = Array.from(labels).some(l => l.innerHTML.includes(expectedDropdownLabel));
    expect(found).to.be.true;
  });

  it('should display all dropdown options', () => {
    const options = htmlRes.getElementsByTagName('option');
    const optionTexts = Array.from(options).map(o => o.innerHTML.trim());
    expect(optionTexts).to.include('Employment advisor');
    expect(optionTexts).to.include('Citizens Advice Bureau');
    expect(optionTexts).to.include('Free Representation Unit');
    expect(optionTexts).to.include('Law centre');
    expect(optionTexts).to.include('Trade union');
    expect(optionTexts).to.include('Solicitor');
    expect(optionTexts).to.include('Private individual');
    expect(optionTexts).to.include('Trade association');
    expect(optionTexts).to.include('Other');
  });

  it('should display the organisation name text input', () => {
    const labels = htmlRes.getElementsByTagName('label');
    const found = Array.from(labels).some(l => l.innerHTML.includes(expectedOrgNameLabel));
    expect(found).to.be.true;
  });

  it('should display the representative name text input', () => {
    const labels = htmlRes.getElementsByTagName('label');
    const found = Array.from(labels).some(l => l.innerHTML.includes(expectedRepNameLabel));
    expect(found).to.be.true;
  });

  it('should display a continue button', () => {
    const buttons = htmlRes.getElementsByClassName(buttonClass);
    const found = Array.from(buttons).some(b => b.innerHTML.toLowerCase().includes('continue'));
    expect(found).to.be.true;
  });

  it('should display a save for later button', () => {
    const buttons = htmlRes.getElementsByClassName(buttonClass);
    const found = Array.from(buttons).some(b => b.innerHTML.toLowerCase().includes('save'));
    expect(found).to.be.true;
  });
});
