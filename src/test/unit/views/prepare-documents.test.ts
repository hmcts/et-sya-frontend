import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockApp } from '../mocks/mockApp';

const prepareDocumentsJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/prepare-documents.json'),
  'utf-8'
);
const prepareDocumentsJson = JSON.parse(prepareDocumentsJsonRaw);
const titleClass = 'govuk-heading-l';
const expectedTitle = prepareDocumentsJson.pHead;
const insetTextClass = 'govuk-inset-text';
const buttonClass = 'govuk-button';
const link = 'govuk-link';

let htmlRes: Document;
describe('Prepare documents page', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.PREPARE_DOCUMENTS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Title does not exist');
  });

  it('should display inset text', () => {
    const insetText = htmlRes.getElementsByClassName(insetTextClass);
    expect(insetText[0].innerHTML).contains(prepareDocumentsJson.insetText, 'Inset text does not exist');
  });

  it('should display start now button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
  });

  it('should display Cancel link', () => {
    const allLinks = htmlRes.getElementsByClassName(link);
    const actual = Array.prototype.slice.call(allLinks).map((element: Element) => {
      return element.innerHTML;
    });
    const hasCancel = actual.some((el: string) => el === 'Cancel');
    expect(hasCancel).to.equal(true);
  });
});
