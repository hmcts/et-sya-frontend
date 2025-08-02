import { expect } from 'chai';

import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { getHtmlRes } from '../test-helpers/requester';

const PAGE_URL = '/change-legal-representative';
const EXPECTED_LEGEND = 'Do you want to change your legal representative?';
const EXPECTED_RADIO_BUTTON1 = 'Yes, I confirm I want to change my legal representative.';
const EXPECTED_RADIO_BUTTON2 =
  'Yes, I confirm I wish to remove my legal representative and continue my case representing myself.';

let htmlRes: Document;
describe('Change legal representative page', () => {
  beforeAll(async () => {
    htmlRes = await getHtmlRes(mockUserCaseComplete, PAGE_URL);
  });

  it('should question', () => {
    const legends = htmlRes.getElementsByTagName('legend');
    expect(legends[0].innerHTML).contains(EXPECTED_LEGEND);
  });

  it('should display radio button option 1', () => {
    const labels = htmlRes.getElementsByTagName('label');
    expect(labels[0].innerHTML).contains(EXPECTED_RADIO_BUTTON1);
  });

  it('should display radio button option 2', () => {
    const labels = htmlRes.getElementsByTagName('label');
    expect(labels[1].innerHTML).contains(EXPECTED_RADIO_BUTTON2);
  });
});
