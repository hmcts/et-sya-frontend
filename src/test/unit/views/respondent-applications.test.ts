import fs from 'fs';
import path from 'path';

import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import request from 'supertest';

import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockApp } from '../mocks/mockApp';

const respondentApplicationsJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/respondent-applications.json'),
  'utf-8'
);

const respondentApplicationsJSON = JSON.parse(respondentApplicationsJSONRaw);
const titleClass = 'govuk-heading-xl';
const columnHeaderClass = 'govuk-table__header';
const cellDataClass = 'govuk-table__cell';

let htmlRes: Document;

describe('Respondent Applications page', () => {
  beforeAll(async () => {
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    caseApi.getUserCase = jest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          case_data: {
            genericTseApplicationCollection: [
              {
                id: 'abc123',
                value: {
                  date: '7 March 2023',
                  type: 'Amend response',
                  applicationState: 'notStartedYet',
                  number: '1',
                  applicant: 'Respondent',
                  copyToOtherPartyYesOrNo: YesOrNo.YES,
                },
              },
              {
                id: 'abc1234',
                value: {
                  date: '8 March 2023',
                  type: 'Restrict publicity',
                  applicationState: 'notStartedYet',
                  number: '2',
                  applicant: 'Respondent',
                  copyToOtherPartyYesOrNo: YesOrNo.YES,
                },
              },
            ],
          },
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    await request(
      mockApp({
        userCase: {
          hubLinksStatuses: {
            respondentApplications: HubLinkStatus.IN_PROGRESS,
          },
        },
      })
    )
      .get(PageUrls.RESPONDENT_APPLICATIONS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(respondentApplicationsJSON.title);
  });

  it('should display table headers', () => {
    const tableHeader = htmlRes.getElementsByClassName(columnHeaderClass);
    expect(tableHeader[0].innerHTML).contains(respondentApplicationsJSON.submitDate, 'Header does not exist');
    expect(tableHeader[1].innerHTML).contains(respondentApplicationsJSON.application, 'Header does not exist');
    expect(tableHeader[2].innerHTML).contains(respondentApplicationsJSON.status, 'Header does not exist');
  });

  it('should display respondent applications first row data', () => {
    const cellDataClassData = htmlRes.getElementsByClassName(cellDataClass);
    expect(cellDataClassData[0].innerHTML).contains('7 March 2023', 'Application date does not exist');
    expect(cellDataClassData[1].innerHTML).contains('Amend response', ' Application type does not exist');
    expect(cellDataClassData[2].innerHTML).contains('Not started yet', 'Application status does not exist');
  });

  it('should display respondent applications second row data', () => {
    const cellDataClassData = htmlRes.getElementsByClassName(cellDataClass);
    expect(cellDataClassData[3].innerHTML).contains('8 March 2023', 'Application date does not exist');
    expect(cellDataClassData[4].innerHTML).contains(
      '/respondent-application-details/abc1234?lng=en',
      'Application url does not exist'
    );
    expect(cellDataClassData[5].innerHTML).contains('Not started yet', 'Application status does not exist');
  });
});
