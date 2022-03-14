import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/your-claim-has-been-submitted';
const expectedTitle = 'Your claim has been submitted';
const panelClass = 'govuk-panel';
const panelTitleClass = 'govuk-panel__title';

let htmlRes: Document;
describe('Claim Submitted Confirmation page', () => {
  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
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
});
