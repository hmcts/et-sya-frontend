import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockApp, mockSession } from '../mocks/mockApp';

const copyToOtherPartyJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/copy-to-other-party.json'),
  'utf-8'
);

const copyToOtherPartyJson = JSON.parse(copyToOtherPartyJsonRaw);
const insetText = 'govuk-inset-text';
const titleClass = 'govuk-heading-xl';
const expectedTitle = copyToOtherPartyJson.title;
const buttonClass = 'govuk-button';
const radios = 'govuk-radios';
const cancelLink = 'govuk-link';
const captionClass = 'govuk-caption-l';
const expectedCaptionApplication = copyToOtherPartyJson.respondToApplication;

let htmlRes: Document;
describe('Copy to the other party page', () => {
  beforeAll(async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
    await request(mockApp({}))
      .get(PageUrls.COPY_TO_OTHER_PARTY)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display inset text', () => {
    const inset = htmlRes.getElementsByClassName(insetText);
    expect(inset[0].innerHTML).contains(copyToOtherPartyJson.p1, 'Inset text does not exist');
    expect(inset[0].innerHTML).contains(copyToOtherPartyJson.p2, 'Inset text does not exist');
    expect(inset[0].innerHTML).contains(copyToOtherPartyJson.p3, 'Inset text does not exist');
  });

  it('should display radio buttons', () => {
    const radioButtons = htmlRes.getElementsByClassName(radios);
    expect(radioButtons.length).equal(1, `only ${radioButtons.length} found`);
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Continue', 'Could not find the button');
  });

  it('should display Cancel link', () => {
    const cancel = htmlRes.getElementsByClassName(cancelLink);
    expect(cancel[5].innerHTML).contains('Cancel', 'Could not find the link');
  });
});

describe('Copy to the other party page - navigating from the Respond to an Application page', () => {
  beforeAll(async () => {
    await request(mockApp({ session: mockSession([], [], []) }))
      .get(PageUrls.COPY_TO_OTHER_PARTY)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display correct caption', () => {
    const caption = htmlRes.getElementsByClassName(captionClass);
    expect(caption[0].innerHTML).contains(expectedCaptionApplication, 'Title caption does not exist');
  });
});
