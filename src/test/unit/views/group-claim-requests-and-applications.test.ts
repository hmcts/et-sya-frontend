import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockApp } from '../mocks/mockApp';

const groupClaimRequestsAndApplicationsJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/group-claim-requests-and-applications.json'),
  'utf-8'
);

const groupClaimRequestsAndApplicationsJson = JSON.parse(groupClaimRequestsAndApplicationsJsonRaw);
const titleClass = 'govuk-heading-xl';
const bodyClass = 'govuk-body';
const columnHeaderClass = 'govuk-table__header';
const cellDataClass = 'govuk-table__cell';

let htmlRes: Document;

describe('Group claim requests and applications page', () => {
  beforeAll(async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);

    await request(
      mockApp({
        userCase: {
          caseType: CaseType.MULTIPLE,
          genericTseApplicationCollection: [
            {
              id: '1',
              value: {
                date: '7 June 2025',
                type: 'Contact about something else',
                applicationState: 'inProgress',
                applicant: 'Claimant',
                copyToOtherPartyYesOrNo: YesOrNo.YES,
              },
            },
          ],
        },
      })
    )
      .get(PageUrls.GROUP_CLAIM_REQUESTS_AND_APPLICATIONS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(groupClaimRequestsAndApplicationsJson.title);
  });

  it('should display paragraphs p1 and p2', () => {
    const mainContent = htmlRes.querySelector('#main-content');
    const paragraphs = mainContent.getElementsByClassName(bodyClass);
    expect(paragraphs[0].innerHTML).contains(groupClaimRequestsAndApplicationsJson.p1);
    expect(paragraphs[1].innerHTML).contains(groupClaimRequestsAndApplicationsJson.p2);
  });

  it('should display table headers', () => {
    const tableHeader = htmlRes.getElementsByClassName(columnHeaderClass);
    expect(tableHeader).to.have.length(3);
  });

  it('should display application row data', () => {
    const cellData = htmlRes.getElementsByClassName(cellDataClass);
    expect(cellData[0].innerHTML).contains('7 June 2025');
  });
});
