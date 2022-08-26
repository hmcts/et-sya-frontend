import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const expectedTitle = 'Check the respondent details';

let htmlRes: Document;
describe('Respondent Details check page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.RESPONDENT_DETAILS_CHECK)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display Add new respondent button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Add another respondent', 'Could not find the button');
  });
});
