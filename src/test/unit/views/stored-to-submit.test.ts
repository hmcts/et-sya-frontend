import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const storedToSubmitJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/stored-to-submit.json'),
  'utf-8'
);
const storedToSubmitJson = JSON.parse(storedToSubmitJsonRaw);

const titleClass = 'govuk-heading-xl';
const headingClass = 'govuk-heading-l';
const detailsClass = 'govuk-body';
const checkBoxClass = 'govuk-checkboxes__input';
const buttonClass = 'govuk-button';
const cancelLink = 'govuk-link';

let htmlRes: Document;

describe('Stored to submit page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          tseApplicationStoredCollection: [
            {
              id: '135',
              value: {
                date: '7 March 2023',
                type: 'Withdraw all/part of claim',
                status: 'notStartedYet',
                number: '1',
                applicant: 'Applicant',
                details: 'Test text',
                copyToOtherPartyYesOrNo: YesOrNo.YES,
              },
            },
          ],
        },
      })
    )
      .get(PageUrls.STORED_TO_SUBMIT.replace(':appId', '135'))
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains('Application to Withdraw my claim', 'Page title does not exist');
  });

  it('should display first paragraph', () => {
    const p1 = htmlRes.getElementsByClassName(detailsClass);
    expect(p1[6].innerHTML).contains(storedToSubmitJson.youHaveNotSubmitted, 'First paragraph does not exist');
  });

  it('should display heading', () => {
    const heading = htmlRes.getElementsByClassName(headingClass);
    expect(heading[0].innerHTML).contains(storedToSubmitJson.confirmYouHaveCopied, 'First paragraph does not exist');
  });

  it('should display checkboxes', () => {
    const checkboxes = htmlRes.getElementsByClassName(checkBoxClass);
    expect(checkboxes.length).equal(1, `only ${checkboxes.length} found`);
  });

  it('should display Submit button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains(storedToSubmitJson.submitBtn, 'Could not find the button');
  });

  it('should display Cancel link', () => {
    const cancel = htmlRes.getElementsByClassName(cancelLink);
    expect(cancel[6].innerHTML).contains('Cancel', 'Could not find the link');
  });
});
