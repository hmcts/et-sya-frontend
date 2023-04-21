import {
  combineDocuments,
  combineUserCaseDocuments,
  findContentTypeByDocument,
  findContentTypeByDocumentDetail,
  findDocumentMimeTypeByExtension,
} from '../../../../main/controllers/helpers/DocumentHelpers';
import { DocumentDetail } from '../../../../main/definitions/definition';
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
