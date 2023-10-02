import fs from 'fs';
import path from 'path';

import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import request from 'supertest';

import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockApp } from '../mocks/mockApp';

const storedAppConfirmationJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/stored-application-confirmation.json'),
  'utf-8'
);
const storedAppComfirmationJson = JSON.parse(storedAppConfirmationJsonRaw);

const panelClass = 'govuk-panel govuk-panel--confirmation';
const titleClass = 'govuk-panel__title';
const pHeader = 'govuk-heading-m';
const buttonClass = 'govuk-button';

let htmlRes: Document;

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      id: '135',
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
      case_data: {
        genericTseApplicationCollection: [
          {
            id: '246',
            value: {
              applicant: 'Claimant',
            },
          },
        ],
      },
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

describe('Stored application confirmation page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PageUrls.STORED_APPLICATION_CONFIRMATION)
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
    expect(title[0].innerHTML).contains(storedAppComfirmationJson.titleText, 'Panel title does not exist');
  });

  it('should display paragraph header', () => {
    const title = htmlRes.getElementsByClassName(pHeader);
    expect(title[2].innerHTML).contains(storedAppComfirmationJson.whatHappensNext, 'Paragraph header does not exist');
  });

  it('should display save and continue and save as draft buttons', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button.length).equal(6, 'Expected six buttons');
    expect(button[5].innerHTML).contains(storedAppComfirmationJson.closeAndReturn, 'Could not find the button');
  });
});
