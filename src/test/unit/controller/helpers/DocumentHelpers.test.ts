import {
  combineDocuments,
  combineUserCaseDocuments,
  findDocumentMimeTypeByExtension
} from '../../../../main/controllers/helpers/DocumentHelpers';
import mockUserCaseWithDocumentsComplete from '../../mocks/mockUserCaseWithDocumentsComplete';

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
    { id: "a0c113ec-eede-472a-a59c-f2614b48177c",
      description: "Claim Summary File Detail",
      originalDocumentName: "document.pdf"
    }
  ]);
});

describe('FindDocumentMimeTypeByExtension', () => {
  it.each(
    [
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
      ['xxx', 'application/pdf']
    ]
  )('If extension is %s then document type is %s',
    (extension:string, documentType: string) =>
    {expect(findDocumentMimeTypeByExtension(extension)).toStrictEqual(documentType)});


});
