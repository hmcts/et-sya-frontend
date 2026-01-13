import axios, { AxiosResponse } from 'axios';

import {
  combineDocuments,
  combineUserCaseDocuments,
  createDownloadLink,
  findContentTypeByDocument,
  findContentTypeByDocumentDetail,
  findDocumentMimeTypeByExtension,
  getDecisionDocId,
  getResponseDocId,
  isJudgmentDocId,
  isRequestDocId,
  isRequestResponseDocId,
  isRequestTribunalResponseDocId,
  isSelectedAppDocId,
  isSelectedAppResponseDocId,
  populateDocumentMetadata,
} from '../../../../main/controllers/helpers/DocumentHelpers';
import { Document } from '../../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls } from '../../../../main/definitions/constants';
import { DecisionAndApplicationDetails, DocumentDetail } from '../../../../main/definitions/definition';
import * as caseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';
import { caseWithDecisionsAndJudgments } from '../../mocks/mockUserCaseWithDecisionsAndJudgments';
import mockUserCaseWithDocumentsComplete from '../../mocks/mockUserCaseWithDocumentsComplete';

const TEST_DOCUMENT_CONTENT_TYPES = {
  DOCX: ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  XLSX: ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  PPTX: ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  DOC: ['doc', 'application/vnd.ms-word'],
  XLS: ['xls', 'application/vnd.ms-excel'],
  PPT: ['ppt', 'application/vnd.ms-powerpoint'],
  CSV: ['csv', 'text/csv'],
  GZ: ['gz', 'application/gzip'],
  GIF: ['gif', 'image/gif'],
  JPEG: ['jpeg', 'image/jpeg'],
  JPG: ['jpg', 'image/jpeg'],
  MP3: ['mp3', 'audio/mpeg'],
  MP4: ['mp4', 'video/mp4'],
  MPEG: ['mpeg', 'video/mpeg'],
  PNG: ['png', 'image/png'],
  PDF: ['pdf', 'application/pdf'],
  TAR: ['tar', 'application/x-tar'],
  TXT: ['txt', 'text/plain'],
  WAV: ['wav', 'audio/wav'],
  WEBA: ['weba', 'audio/webm'],
  WEBM: ['webm', 'video/webm'],
  WEBP: ['webp', 'image/webp'],
  ZIP: ['zip', 'application/zip'],
  _3GP: ['3gp', 'video/3gpp'],
  _3G2: ['3g2', 'video/3gpp2'],
  _7Z: ['7z', 'application/x-7z-compressed'],
  DOT: ['dot', 'application/msword'],
  BMP: ['bmp', 'image/bmp'],
  TIF: ['tif', 'image/tiff'],
  TIFF: ['tiff', 'image/tiff'],
  XLT: ['xlt', 'application/vnd.ms-excel'],
  XLA: ['xla', 'application/vnd.ms-excel'],
  XLTX: ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
  XLSB: ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
  POT: ['pot', 'application/mspowerpoint'],
  PPS: ['pps', 'application/vnd.ms-powerpoint'],
  PPA: ['ppa', 'application/vnd.ms-powerpoint'],
  POTX: ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
  PPSX: ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
  RTF: ['rtf', 'application/rtf'],
  RTX: ['rtx', 'application/rtf'],
  NULL_VALUE: [null as never, undefined as never],
  UNDEFINED_VALUE: [undefined as never, undefined as never],
  EMPTY_STRING: ['', undefined],
  XXX: ['xxx', undefined],
};

const documentDetailWithMimeType = {
  id: '1',
  description: 'desc',
  mimeType: 'image/jpeg',
  size: '123',
  createdOn: '01/12/2023',
};

const documentDetailWithOriginalDocumentName = {
  id: '1',
  description: 'desc',
  size: '123',
  createdOn: '01/12/2023',
  originalDocumentName: 'test.doc',
};

const documentDetailWithoutMimeTypeAndOriginalDocumentName = {
  id: '1',
  description: 'desc',
  size: '123',
  createdOn: '01/12/2023',
};

const documentWithContentType = {
  headers: {
    originalfilename: 'ET1_CASE_DOCUMENT_Random_Man.pdf',
    'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.pdf"',
    'data-source': 'contentURI',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'DENY',
    date: 'Thu, 20 Apr 2023 10:35:17 GMT',
    'keep-alive': 'timeout=60',
    connection: 'keep-alive, keep-alive, close',
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'content-type': 'application/vnd.ms-excel',
    'content-length': '244991',
  },
  data: 'text',
};

const documentWithOriginalFileName = {
  headers: {
    originalfilename: 'ET1_CASE_DOCUMENT_Random_Man.doc',
    'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.doc"',
    'data-source': 'contentURI',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'DENY',
    date: 'Thu, 20 Apr 2023 10:35:17 GMT',
    'keep-alive': 'timeout=60',
    connection: 'keep-alive, keep-alive, close',
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'content-length': '244991',
  },
  data: 'text',
};

const documentWithFileName = {
  headers: {
    'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.ppt"',
    'data-source': 'contentURI',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'DENY',
    date: 'Thu, 20 Apr 2023 10:35:17 GMT',
    'keep-alive': 'timeout=60',
    connection: 'keep-alive, keep-alive, close',
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'content-length': '244991',
  },
  data: 'text',
};

const documentWithInvalidOriginalFileName = {
  headers: {
    originalfilename: 'ET1_CASE_DOCUMENT_Random_Man.xyz',
    'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.xyz"',
    'data-source': 'contentURI',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'DENY',
    date: 'Thu, 20 Apr 2023 10:35:17 GMT',
    'keep-alive': 'timeout=60',
    connection: 'keep-alive, keep-alive, close',
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'content-length': '244991',
  },
  data: 'text',
};

const documentWithInvalidFileName = {
  headers: {
    'content-disposition': 'fileName="ET1_CASE_DOCUMENT_Random_Man.yzx"',
    'data-source': 'contentURI',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'DENY',
    date: 'Thu, 20 Apr 2023 10:35:17 GMT',
    'keep-alive': 'timeout=60',
    connection: 'keep-alive, keep-alive, close',
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'content-length': '244991',
  },
  data: 'text',
};

const documentWithoutContentTypeAndFileName = {
  headers: {
    'data-source': 'contentURI',
    'x-content-type-options': 'nosniff',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'DENY',
    date: 'Thu, 20 Apr 2023 10:35:17 GMT',
    'keep-alive': 'timeout=60',
    connection: 'keep-alive, keep-alive, close',
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    pragma: 'no-cache',
    expires: '0',
    'content-length': '244991',
  },
  data: 'text',
};

const testDoc1 = {
  document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
  document_filename: 'testDoc1.pdf',
  document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
};

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

it('should create download link with just filename (no size or type)', () => {
  const doc: Document = {
    document_url: 'uuid',
    document_filename: 'test.pdf',
    document_binary_url: '',
  };
  const mockLink = "<a href='/getSupportingMaterial/uuid' target='_blank' class='govuk-link'>test.pdf</a>";
  const createdLink = createDownloadLink(doc);
  expect(mockLink).toStrictEqual(createdLink);
});

it('should return empty string if document filename or url is missing', () => {
  const docWithoutFilename: Document = {
    document_url: 'uuid',
    document_filename: '',
    document_binary_url: '',
  };
  expect(createDownloadLink(docWithoutFilename)).toStrictEqual('');

  const docWithoutUrl: Document = {
    document_url: '',
    document_filename: 'test.pdf',
    document_binary_url: '',
  };
  expect(createDownloadLink(docWithoutUrl)).toStrictEqual('');
});

it('should update document createdOn value', async () => {
  const doc: Document = {
    document_url: 'test.url',
    document_filename: 'test.pdf',
    document_binary_url: 'test.binary.url',
  };
  const testRawId = 'http://test/qweqweqw-qweqweqwe';

  const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');
  const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
  getCaseApiClientMock.mockReturnValue(caseApi);
  caseApi.getDocumentDetails = jest.fn().mockResolvedValue(axiosResponse);

  const modifiedDoc = await populateDocumentMetadata(doc, testRawId);

  expect(modifiedDoc.createdOn).toEqual('8 September 2022');
});

it('should combine user case documents correctly', () => {
  expect(combineUserCaseDocuments([mockUserCaseWithDocumentsComplete])).toStrictEqual([
    { description: 'Case Details - Sunday Ayeni', id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673', type: 'ET1' },
    { id: '1', description: 'desc1' },
    { id: '2', description: 'desc2' },
    { id: '3', description: 'desc3' },
    { id: '4', description: 'desc4' },
    { id: '5', description: 'desc5' },
    { id: '6', description: 'desc6' },
    { id: '7', description: 'desc7' },
    { id: '8', description: 'desc8' },
    {
      id: 'a0c113ec-eede-472a-a59c-f2614b48177c',
      description: 'Claim Summary File Detail',
      originalDocumentName: 'document.pdf',
    },
  ]);
});

describe('FindContentTypeByDocument', () => {
  it.each([
    [documentWithContentType, 'application/vnd.ms-excel'],
    [documentWithOriginalFileName, 'application/vnd.ms-word'],
    [documentWithFileName, 'application/vnd.ms-powerpoint'],
    [documentWithInvalidOriginalFileName, undefined],
    [documentWithInvalidFileName, undefined],
    [documentWithoutContentTypeAndFileName, undefined],
  ])('%o document type should be %s', (documentItem: never, contentType: string) => {
    expect(findContentTypeByDocument(documentItem)).toStrictEqual(contentType);
  });
});

describe('FindContentTypeByDocumentDetail', () => {
  it.each([
    [documentDetailWithMimeType, 'image/jpeg'],
    [documentDetailWithOriginalDocumentName, 'application/vnd.ms-word'],
    [documentDetailWithoutMimeTypeAndOriginalDocumentName, undefined],
  ])('%o document type should be %s', (documentDetailItem: DocumentDetail, contentType: string) => {
    expect(findContentTypeByDocumentDetail(documentDetailItem)).toStrictEqual(contentType);
  });
});

describe('FindDocumentMimeTypeByExtension', () => {
  it.each(Object.values(TEST_DOCUMENT_CONTENT_TYPES).map(value => [value[0], value[1]]))(
    'If extension is %s then document type is %s',
    (extension: string, documentType: string) => {
      expect(findDocumentMimeTypeByExtension(extension)).toStrictEqual(documentType);
    }
  );
});

describe('getResponseDocId', () => {
  it('should return the correct response document ID', () => {
    const selectedApplication = caseWithDecisionsAndJudgments.genericTseApplicationCollection[0];
    const result = getResponseDocId(selectedApplication);
    expect(result).toEqual('uuid2');
  });

  it('should return undefined when no response document is present', () => {
    const selectedApplication: GenericTseApplicationTypeItem = {
      value: {
        respondCollection: [],
      },
    };
    const result = getResponseDocId(selectedApplication);
    expect(result).toBeUndefined();
  });

  it('should return undefined when response document is not available', () => {
    const selectedApplication: GenericTseApplicationTypeItem = {
      value: {
        respondCollection: [
          {
            value: {
              supportingMaterial: [],
            },
          },
        ],
      },
    };

    const result = getResponseDocId(selectedApplication);
    expect(result).toBeUndefined();
  });
});

describe('getDecisionDocId', () => {
  it('should return the correct decision document ID', () => {
    const req = mockRequest({});
    req.params.docId = 'uuid3';
    const selectedApplication = caseWithDecisionsAndJudgments.genericTseApplicationCollection[0];
    const result = getDecisionDocId(req, selectedApplication);
    expect(result).toEqual('uuid3');
  });

  it('should return undefined when no decision document matches the docId', () => {
    const req = mockRequest({});
    req.params.docId = '1a2b3c4d5e6f7g8h';

    const selectedApplication = caseWithDecisionsAndJudgments.genericTseApplicationCollection[0];

    const result = getDecisionDocId(req, selectedApplication);
    expect(result).toBeUndefined();
  });

  it('should return undefined when no admin decision is available', () => {
    const req = mockRequest({});
    req.params.docId = '1a2b3c4d5e6f7g8h';

    const selectedApplication: GenericTseApplicationTypeItem = {
      value: {
        adminDecision: [],
      },
    };

    const result = getDecisionDocId(req, selectedApplication);
    expect(result).toBeUndefined();
  });

  it('should return undefined when responseRequiredDoc is undefined', () => {
    const req = mockRequest({});
    req.params.docId = '1a2b3c4d5e6f7g8h';

    const selectedApplication: GenericTseApplicationTypeItem = {
      value: {
        adminDecision: [
          {
            value: {
              responseRequiredDoc: undefined,
            },
          },
        ],
      },
    };

    const result = getDecisionDocId(req, selectedApplication);
    expect(result).toBeUndefined();
  });
});

describe('getSelectedAppDocId', () => {
  it('should return the correct selected application document ID', () => {
    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {
          documentUpload: testDoc1,
        },
      },
    ];

    const result = isSelectedAppDocId('10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa', appsAndDecisions);
    expect(result).toBeTruthy();
  });

  it('should return undefined when no selected application document matches the docId', () => {
    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {
          documentUpload: testDoc1,
        },
      },
    ];

    const result = isSelectedAppDocId('1a2b3c4d5e6f7g8h', appsAndDecisions);
    expect(result).toBeFalsy();
  });

  it('should return undefined when no documentUpload is available', () => {
    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {},
      },
    ];

    const result: boolean = isSelectedAppDocId('10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa', appsAndDecisions);
    expect(result).toBeFalsy();
  });

  it('should return undefined when documentUpload is undefined', () => {
    const req = mockRequest({});
    req.params.docId = '1a2b3c4d5e6f7g8h';

    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {
          documentUpload: undefined,
        },
      },
    ];

    const result: boolean = isSelectedAppDocId('1a2b3c4d5e6f7g8h', appsAndDecisions);
    expect(result).toBeFalsy();
  });
});

describe('isSelectedAppResponseDocId', () => {
  it('should return the correct selected application response document ID', () => {
    const appsWithDecisions: GenericTseApplicationTypeItem[] = [
      {
        id: '1',
        value: {
          respondCollection: [
            {
              value: {
                from: 'Claimant',
                supportingMaterial: [
                  {
                    value: {
                      uploadedDocument: testDoc1,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    const result = isSelectedAppResponseDocId('10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa', appsWithDecisions);
    expect(result).toBeTruthy();
  });

  it('should return undefined when no selected application response document matches the docId', () => {
    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {
          respondCollection: [
            {
              value: {
                supportingMaterial: [
                  {
                    value: {
                      uploadedDocument: testDoc1,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    const result = isSelectedAppResponseDocId('1a2b3c4d5e6f7g8h', appsAndDecisions);
    expect(result).toBeFalsy();
  });

  it('should return undefined when no respondCollection is available', () => {
    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {},
      },
    ];

    const result = isSelectedAppResponseDocId('10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa', appsAndDecisions);
    expect(result).toBeFalsy();
  });

  it('should return undefined when supportingMaterial is empty', () => {
    const appsAndDecisions: DecisionAndApplicationDetails[] = [
      {
        value: {
          respondCollection: [
            {
              value: {
                supportingMaterial: [],
              },
            },
          ],
        },
      },
    ];

    const result = isSelectedAppResponseDocId('10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa', appsAndDecisions);
    expect(result).toBeFalsy();
  });
});

describe('getRequestDocId', () => {
  it('should return the correct request document ID for Tribunal page', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [
                {
                  value: {
                    uploadedDocument: testDoc1,
                  },
                },
              ],
            },
          },
        },
      },
    });
    const result = isRequestDocId(req, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeTruthy();
  });

  it('should return the correct request document ID for general correspondence page', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [
                {
                  value: {
                    uploadedDocument: testDoc1,
                  },
                },
              ],
            },
          },
        },
      },
    });
    const result = isRequestDocId(req, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeTruthy();
  });

  it('should return undefined when no request document matches the docId', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [
                {
                  value: {
                    uploadedDocument: testDoc1,
                  },
                },
              ],
            },
          },
        },
      },
    });
    req.params.docId = '1a2b3c4d5e6f7g8h';
    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });

  it('should return undefined when sendNotificationUploadDocument is empty', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [],
            },
          },
        },
      },
    });
    req.params.docId = '1a2b3c4d5e6f7g8h';
    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });

  it('should return undefined when session or userCase is undefined', () => {
    const req = mockRequest({});

    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });
});

describe('getJudgmentDocId', () => {
  it('should return the correct judgment document ID', () => {
    const req = mockRequest({
      session: {
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [
                {
                  value: {
                    uploadedDocument: testDoc1,
                  },
                },
              ],
            },
          },
        },
      },
    });
    const result = isJudgmentDocId(req.session.userCase, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeTruthy();
  });

  it('should return false when no judgment document matches the docId', () => {
    const req = mockRequest({
      session: {
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [
                {
                  value: {
                    uploadedDocument: testDoc1,
                  },
                },
              ],
            },
          },
        },
      },
    });

    const result = isJudgmentDocId(req.session.userCase, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492af');
    expect(result).toBeFalsy();
  });

  it('should return false when no sendNotificationUploadDocument is available', () => {
    const req = mockRequest({
      session: {
        userCase: {
          selectedRequestOrOrder: {
            value: {
              sendNotificationUploadDocument: [],
            },
          },
        },
      },
    });

    const result = isJudgmentDocId(req.session.userCase, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeFalsy();
  });

  it('should return false when session or userCase is undefined', () => {
    const req = mockRequest({});
    req.params.docId = '1a2b3c4d5e6f7g8h';

    const result = isJudgmentDocId(req.session.userCase, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeFalsy();
  });
});

describe('getRequestTribunalResponseDocId', () => {
  it('should return the correct tribunal response document ID for Tribunal page', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              respondNotificationTypeCollection: [
                {
                  id: '1',
                  value: {
                    respondNotificationUploadDocument: [
                      {
                        value: {
                          uploadedDocument: testDoc1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });
    const result = isRequestTribunalResponseDocId(req, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeTruthy();
  });

  it('should return undefined when no document matches the docId', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              respondNotificationTypeCollection: [
                {
                  id: '1',
                  value: {
                    respondNotificationUploadDocument: [
                      {
                        value: {
                          uploadedDocument: testDoc1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });
    req.params.docId = '1a2b3c4d5e6f7g8h';
    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });

  it('should return undefined when respondNotificationUploadDocument is empty', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              respondNotificationTypeCollection: [
                {
                  id: '1',
                  value: {
                    respondNotificationUploadDocument: [],
                  },
                },
              ],
            },
          },
        },
      },
    });
    req.params.docId = '1a2b3c4d5e6f7g8h';
    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });

  it('should return undefined when session or userCase is undefined', () => {
    const req = mockRequest({});

    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });
});

describe('getRequestResponseDocId', () => {
  it('should return the correct response document ID for Tribunal page', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              respondCollection: [
                {
                  id: '1',
                  value: {
                    supportingMaterial: [
                      {
                        value: {
                          uploadedDocument: testDoc1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });
    const result = isRequestResponseDocId(req, '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa');
    expect(result).toBeTruthy();
  });

  it('should return undefined when no document matches the docId', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              respondCollection: [
                {
                  id: '1',
                  value: {
                    supportingMaterial: [
                      {
                        value: {
                          uploadedDocument: testDoc1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });
    req.params.docId = '1a2b3c4d5e6f7g8h';
    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });

  it('should return undefined when supportingMaterial is empty', () => {
    const req = mockRequest({
      session: {
        documentDownloadPage: PageUrls.NOTIFICATION_DETAILS,
        userCase: {
          selectedRequestOrOrder: {
            value: {
              respondCollection: [
                {
                  id: '1',
                  value: {
                    supportingMaterial: [],
                  },
                },
              ],
            },
          },
        },
      },
    });
    req.params.docId = '1a2b3c4d5e6f7g8h';
    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });

  it('should return undefined when session or userCase is undefined', () => {
    const req = mockRequest({});

    const result = isRequestDocId(req, '1a2b3c4d5e6f7g8h');
    expect(result).toBeFalsy();
  });
});
