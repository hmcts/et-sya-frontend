import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const storedAppConfirmationJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/stored-application-confirmation.json'),
  'utf-8'
);
const storedAppConfirmationJson = JSON.parse(storedAppConfirmationJsonRaw);

const panelClass = 'govuk-panel govuk-panel--confirmation';
const titleClass = 'govuk-panel__title';
const pHeader = 'govuk-heading-m';
const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Stored application confirmation page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          genericTseApplicationCollection: [
            {
              id: 'abc123',
              value: {
                date: '7 March 2023',
                type: 'amend',
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
      .get(PageUrls.STORED_APPLICATION_CONFIRMATION.replace(':appId', 'abc123'))
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display GDS panel component', () => {
    const panel = htmlRes.getElementsByClassName(panelClass);
    expect(panel.length).equal(1, 'Single panel component does not exist');
  });

  it('should display panel title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(storedAppConfirmationJson.title, 'Panel title does not exist');
  });

  it('should display paragraph header', () => {
    const title = htmlRes.getElementsByClassName(pHeader);
    expect(title[2].innerHTML).contains(storedAppConfirmationJson.whatHappensNext, 'Paragraph header does not exist');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[5].innerHTML).contains(storedAppConfirmationJson.closeAndReturn, 'Could not find the button');
  });
});
