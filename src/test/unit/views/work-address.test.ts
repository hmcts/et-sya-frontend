import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-xl';
const expectedTitle = 'Did you work at [first line of respondent address]?';

let htmlRes: Document;
describe('Work address', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          selectedRespondent: 1,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Globo Gym',
            },
          ],
        },
      })
    )
      .get(PageUrls.WORK_ADDRESS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });
});
