import {
  combineDocuments,
  combineUserCaseDocuments,
  findContentTypeByDocument,
  findContentTypeByDocumentDetail,
  findDocumentMimeTypeByExtension,
} from '../../../../main/controllers/helpers/DocumentHelpers';
import { DocumentDetail } from '../../../../main/definitions/definition';
import mockUserCaseWithDocumentsComplete from '../../mocks/mockUserCaseWithDocumentsComplete';

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
    [documentWithOriginalFileName, 'application/msword'],
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
    [documentDetailWithOriginalDocumentName, 'application/msword'],
    [documentDetailWithoutMimeTypeAndOriginalDocumentName, undefined],
  ])('%o document type should be %s', (documentDetailItem: DocumentDetail, contentType: string) => {
    expect(findContentTypeByDocumentDetail(documentDetailItem)).toStrictEqual(contentType);
  });
});

describe('FindDocumentMimeTypeByExtension', () => {
  it.each([
    [null, undefined],
    [undefined, undefined],
    ['', undefined],
    ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['doc', 'application/msword'],
    ['xls', 'application/vnd.ms-excel'],
    ['ppt', 'application/vnd.ms-powerpoint'],
    ['csv', 'text/csv'],
    ['gz', 'application/gzip'],
    ['gif', 'image/gif'],
    ['jpeg', 'image/jpeg'],
    ['jpg', 'image/jpeg'],
    ['mp3', 'audio/mpeg'],
    ['mp4', 'video/mp4'],
    ['mpeg', 'video/mpeg'],
    ['png', 'image/png'],
    ['pdf', 'application/pdf'],
    ['tar', 'application/x-tar'],
    ['txt', 'text/plain'],
    ['wav', 'audio/wav'],
    ['weba', 'audio/webm'],
    ['webm', 'video/webm'],
    ['webp', 'image/webp'],
    ['zip', 'application/zip'],
    ['3gp', 'video/3gpp'],
    ['3g2', 'video/3gpp2'],
    ['7z', 'application/x-7z-compressed'],
    ['xxx', undefined],
  ])('If extension is %s then document type is %s', (extension: string, documentType: string) => {
    expect(findDocumentMimeTypeByExtension(extension)).toStrictEqual(documentType);
  });
});
