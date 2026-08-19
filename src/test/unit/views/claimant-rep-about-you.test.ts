import { expect } from 'chai';

import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { getHtmlRes } from '../test-helpers/requester';

const PAGE_URL = '/claimant-rep-about-you/' + mockUserCaseComplete.id;
const titleClass = 'govuk-heading-xl';
const expectedTitle = 'About you';
const expectedLabels = [
  'Name',
  'Organisation',
  'Type of representative',
  'Enter a UK postcode',
  'Building and street',
  'Address line 2',
  'Address line 3',
  'Postcode',
  'Email',
  'Phone',
];

const mockAddresses = [
  {
    fullAddress: '1 Tooting Broadway, London, SE17 1NE',
    street1: '1 Tooting Broadway',
    town: 'London',
    postcode: 'SE17 1NE',
    country: 'United Kingdom',
  },
];

let htmlRes: Document;

describe('Claimant rep about you page', () => {
  beforeAll(async () => {
    htmlRes = await getHtmlRes(mockUserCaseComplete, PAGE_URL);
  });

  it('should display the page title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display a label for every field', () => {
    const labels = Array.from(htmlRes.getElementsByTagName('label')).map(l => l.innerHTML.trim());
    expectedLabels.forEach(label => expect(labels).to.include(label));
  });

  it('should display the find address button', () => {
    const buttons = Array.from(htmlRes.getElementsByTagName('button'));
    const findAddress = buttons.find(b => b.innerHTML.includes('Find address'));
    expect(findAddress).to.not.be.undefined;
    expect(findAddress.getAttribute('name')).to.equal('findAddress');
  });

  it('should display the save button and cancel link', () => {
    const buttons = Array.from(htmlRes.getElementsByTagName('button'));
    expect(buttons.some(b => b.innerHTML.includes('Save'))).to.be.true;
    const links = Array.from(htmlRes.getElementsByTagName('a'));
    expect(links.some(a => a.innerHTML.trim() === 'Cancel')).to.be.true;
  });

  it('should not list addresses before a postcode lookup is made', () => {
    const selects = Array.from(htmlRes.getElementsByTagName('select')).map(s => s.getAttribute('name'));
    expect(selects).to.not.include('representativeAddressTypes');
  });

  describe('after a postcode lookup', () => {
    let lookupRes: Document;

    beforeAll(async () => {
      lookupRes = await getHtmlRes(
        { ...mockUserCaseComplete, representativeAddresses: mockAddresses } as never,
        PAGE_URL
      );
    });

    it('should list the addresses found next to the postcode field', () => {
      const select = Array.from(lookupRes.getElementsByTagName('select')).find(
        s => s.getAttribute('name') === 'representativeAddressTypes'
      );
      expect(select).to.not.be.undefined;
      const options = Array.from(select.getElementsByTagName('option')).map(o => o.innerHTML.trim());
      expect(options).to.include('1 address found');
      expect(options).to.include('1 Tooting Broadway, London, SE17 1NE');
    });

    it('should display the use this address button', () => {
      const buttons = Array.from(lookupRes.getElementsByTagName('button'));
      const useThisAddress = buttons.find(b => b.innerHTML.includes('Use this address'));
      expect(useThisAddress).to.not.be.undefined;
      expect(useThisAddress.getAttribute('name')).to.equal('selectAddress');
    });
  });
});
