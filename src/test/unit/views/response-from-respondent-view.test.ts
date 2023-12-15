import fs from 'fs';
import path from 'path';

import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import request from 'supertest';

import { NoAcasNumberReason, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { ClaimTypeDiscrimination, TellUsWhatYouWant, TypesOfClaim } from '../../../main/definitions/definition';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import { CaseApi } from '../../../main/services/CaseService';
import * as caseService from '../../../main/services/CaseService';
import { mockApp } from '../mocks/mockApp';

const responseFromRespondentJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/response-from-respondent.json'),
  'utf-8'
);
const responseFromRespondentJson = JSON.parse(responseFromRespondentJsonRaw);
const captionClass = 'govuk-table__caption govuk-table__caption--m';
const expectedCaption = responseFromRespondentJson.h2;
const targetUrl = PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT;

let htmlRes: Document;

jest.mock('axios');
const axiosResponse: AxiosResponse = {
  data: {
    classification: 'PUBLIC',
    size: 10575,
    mimeType: 'application/pdf',
    originalDocumentName: 'sample.pdf',
    createdOn: '2022-09-08T14:39:32.000+00:00',
    createdBy: '7',
    lastModifiedBy: '7',
    modifiedOn: '2022-09-08T14:40:49.000+00:00',
    metadata: {
      jurisdiction: '',
      case_id: '1',
      case_type_id: '',
    },
  },
  status: 200,
  statusText: '',
  headers: undefined,
  config: undefined,
};
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
getCaseApiClientMock.mockReturnValue(caseApi);
caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

describe('Response From Respondent page', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          typeOfClaim: [TypesOfClaim.DISCRIMINATION, TypesOfClaim.WHISTLE_BLOWING],
          claimantWorkAddressQuestion: YesOrNo.NO,
          pastEmployer: YesOrNo.YES,
          noticePeriod: YesOrNo.YES,
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'John Does',
              respondentAddress1: 'Ministry of Justice, Seventh Floor, 102, Petty France, London, SW1H 9AJ',
              acasCert: YesOrNo.YES,
              acasCertNum: 'R123456/12/12',
            },
            {
              respondentNumber: 2,
              respondentName: 'Test Two',
              respondentAddress1: '10 Test Street, Test, AB1 2CD',
              acasCert: YesOrNo.NO,
              noAcasReason: NoAcasNumberReason.ANOTHER,
            },
          ],
          responseEt3FormDocumentDetail: [
            {
              id: '1',
              description: 'test description',
            },
          ],
          hubLinksStatuses: new HubLinksStatuses(),
          claimTypeDiscrimination: [ClaimTypeDiscrimination.AGE],
          tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY, TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION],
        },
      })
    )
      .get(targetUrl)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display ET3 Form H2 title', () => {
    const title = htmlRes.getElementsByClassName(captionClass);
    expect(title[0].innerHTML).contains(expectedCaption, 'ET3 Form Raws Caption does not exist');
  });
});
