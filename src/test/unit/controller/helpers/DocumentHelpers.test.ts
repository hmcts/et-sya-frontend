import axios, { AxiosResponse } from 'axios';

import {
  combineDocuments,
  createDownloadLink,
  getDocumentAdditionalInformation,
} from '../../../../main/controllers/helpers/DocumentHelpers';
import { Document } from '../../../../main/definitions/case';
import * as caseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';

it('should combine documents correctly', () => {
  expect(
    combineDocuments(
      [
        { id: '1', description: 'desc1' },
        { id: '2', description: 'desc2' },
      ],
      [{ id: '3', description: 'desc3' }],
      [undefined],
      undefined
    )
  ).toStrictEqual([
    { id: '1', description: 'desc1' },
    { id: '2', description: 'desc2' },
    { id: '3', description: 'desc3' },
  ]);
});

it('should create proper download link for TSE CYA', () => {
  const doc: Document = {
    document_url: 'uuid',
    document_filename: 'test.pdf',
    document_binary_url: '',
    document_size: 1000,
    document_mime_type: 'pdf',
  };
  const mockLink = "<a href='/getSupportingMaterial/uuid' target='_blank' class='govuk-link'>test.pdf(pdf, 1000Bytes)</a>";
  const createdLink = createDownloadLink(doc);
  expect(mockLink).toStrictEqual(createdLink);
});

it('should update document size and mime type values', async () => {
  const doc: Document = {
    document_url: 'test.url',
    document_filename: 'test.pdf',
    document_binary_url: 'test.binary.url',
    document_size: undefined,
    document_mime_type: undefined,
  };
  const testRawId = 'http://test/qweqweqw-qweqweqwe';

  const axiosResponse: AxiosResponse = {
    data: {
      classification: 'PUBLIC',
      size: 10575,
      mimeType: 'pdf',
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

  const modifiedDoc = await getDocumentAdditionalInformation(doc, testRawId);

  expect(modifiedDoc.document_size).toEqual(10575);
  expect(modifiedDoc.document_mime_type).toEqual('pdf');
});
