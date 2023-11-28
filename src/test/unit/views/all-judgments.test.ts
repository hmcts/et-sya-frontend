import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { SendNotificationType } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const allJudgmentsJSONRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/all-judgments.json'),
  'utf-8'
);

const allJudgmentsJSON = JSON.parse(allJudgmentsJSONRaw);
const titleClass = 'govuk-heading-xl';
const columnHeaderClass = 'govuk-table__header';
const cellDataClass = 'govuk-table__cell';

let htmlRes: Document;

describe('All judgments page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          sendNotificationCollection: [
            {
              id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
              value: {
                date: '2022-05-05',
                sendNotificationTitle: 'Test judgment',
                notificationState: 'notViewedYet',
                sendNotificationSubjectString: 'Judgment',
              } as SendNotificationType,
            },
          ],
        },
      })
    )
      .get(PageUrls.ALL_JUDGMENTS)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(allJudgmentsJSON.title);
  });

  it('should display table headers', () => {
    const tableHeader = htmlRes.getElementsByClassName(columnHeaderClass);
    expect(tableHeader[0].innerHTML).contains(allJudgmentsJSON.dateSent, 'Header does not exist');
    expect(tableHeader[1].innerHTML).contains(allJudgmentsJSON.judgment, 'Header does not exist');
    expect(tableHeader[2].innerHTML).contains(allJudgmentsJSON.status, 'Header does not exist');
  });

  it('should display the judgment', () => {
    const cellDataClassData = htmlRes.getElementsByClassName(cellDataClass);
    expect(cellDataClassData[0].innerHTML).contains('5 May 2022', 'Judgment date does not exist');
    expect(cellDataClassData[1].innerHTML).contains(
      '/judgment-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en',
      'Judgment url does not exist'
    );
    expect(cellDataClassData[2].innerHTML).contains('Not viewed yet', 'Judgment status does not exist');
  });
});
