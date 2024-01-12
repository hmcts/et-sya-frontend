import {
  compareUploadDates,
  createSortedDocumentsMap,
  documentHasToBeFiltered,
  filterRespondentsDocuments,
  getTableCaption,
  isBundlesDoc,
  mapDocumentToTableRow,
  prepareTableRows,
} from '../../../../main/controllers/helpers/AllDocumentsHelper';
import { DocumentTypeItem } from '../../../../main/definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes } from '../../../../main/definitions/constants';
import allDocsRaw from '../../../../main/resources/locales/en/translation/all-documents.json';
import { mockRequest } from '../../mocks/mockRequest';
import {
  caseWithGenericTseApplications,
  uploadedDoc,
  uploadedDoc2,
  uploadedDoc3,
} from '../../mocks/mockUserCaseWithRespondentDocuments';

describe('allDocumentsHelper tests', () => {
  const mockDocumentTypeItem: DocumentTypeItem = {
    id: 'mockId',
    value: {
      shortDescription: 'Description',
      uploadedDocument: uploadedDoc,
    },
    downloadLink: 'mockDownloadLink',
  };

  const docs: DocumentTypeItem[] = [
    {
      id: '1',
      value: {
        typeOfDocument: 'Claimant correspondence',
        shortDescription: 'Claimant correspondence',
        uploadedDocument: uploadedDoc,
      },
    },
    {
      id: '2',
      value: {
        typeOfDocument: 'ACAS Certificate',
        shortDescription: 'ACAS Certificate',
        uploadedDocument: uploadedDoc,
      },
    },
    {
      id: '3',
      value: {
        typeOfDocument: 'Respondent correspondence',
        shortDescription: 'Respondent correspondence',
        uploadedDocument: uploadedDoc2,
      },
    },
    {
      id: '4',
      value: {
        typeOfDocument: 'Tribunal correspondence',
        shortDescription: 'Tribunal correspondence',
        uploadedDocument: uploadedDoc2,
      },
    },
  ];

  const docsToTest: DocumentTypeItem[] = [
    {
      id: '1',
      value: {
        typeOfDocument: 'Claimant correspondence',
        shortDescription: 'Claimant correspondence',
        uploadedDocument: uploadedDoc,
      },
    },
    {
      id: '2',
      value: {
        typeOfDocument: 'ACAS Certificate',
        shortDescription: 'ACAS Certificate',
        uploadedDocument: uploadedDoc,
      },
    },
    {
      id: '3',
      value: {
        typeOfDocument: 'Respondent correspondence',
        shortDescription: 'Respondent correspondence',
        uploadedDocument: uploadedDoc2,
      },
    },
    {
      id: '4',
      value: {
        typeOfDocument: 'Tribunal correspondence',
        shortDescription: 'Tribunal correspondence',
        uploadedDocument: uploadedDoc2,
      },
    },
    {
      id: '5',
      value: {
        typeOfDocument: 'Tribunal correspondence',
        shortDescription: 'Tribunal correspondence',
        uploadedDocument: uploadedDoc3,
      },
    },
  ];

  const bundleDocuments: DocumentTypeItem[] = [
    {
      id: '',
      value: {
        typeOfDocument: 'Claimant Hearing Document',
        shortDescription: 'Claimant Hearing Document',
        uploadedDocument: {
          document_url: 'http://address/documents/123',
          document_filename: 'mockTypeOfDocument',
          document_binary_url: 'mockCreationDate',
          createdOn: '01/02/2023',
        },
      },
    },
  ];

  const translationJsons = { ...allDocsRaw };
  const sortedMap = createSortedDocumentsMap(docs);

  it('returns true when rule92 is No and typeOfApp is included in respondent A or B', () => {
    const result = documentHasToBeFiltered('No', 'Amend response');
    expect(result).toBe(true);
  });

  it('returns true when rule92 is No and typeOfApp is included in respondent C', () => {
    const result = documentHasToBeFiltered('No', 'Order a witness to attend to give evidence');
    expect(result).toBe(true);
  });

  it('returns false when rule92 is Yes', () => {
    const result = documentHasToBeFiltered('Yes', 'Change personal details');
    expect(result).toBe(false);
  });

  it('map document to table row', () => {
    const result = mapDocumentToTableRow(mockDocumentTypeItem, translationJsons);
    expect(result.date).toEqual('03/01/2024');
    expect(result.description).toEqual('Description');
    expect(result.downloadLink).toEqual('mockDownloadLink');
  });

  it('should get proper table caption', () => {
    const result = getTableCaption('ACAS Certificate', translationJsons);
    expect(result).toEqual('Acas documents');
  });

  it('should return undefined table caption', () => {
    const result = getTableCaption('N/A', translationJsons);
    expect(result).toEqual(undefined);
  });

  it('returns a sorted map of documents', () => {
    expect(sortedMap.get(AllDocumentTypes.CLAIMANT_CORRESPONDENCE)).toEqual([docs[0]]);
    expect(sortedMap.get(AllDocumentTypes.ACAS_CERT)).toEqual([docs[1]]);
    expect(sortedMap.get(AllDocumentTypes.RESPONDENT_CORRESPONDENCE)).toEqual([docs[2]]);
    expect(sortedMap.get(AllDocumentTypes.TRIBUNAL_CORRESPONDENCE)).toEqual([docs[3]]);
  });

  it('returns a sorted array of documents', () => {
    const sortedDocsArray: DocumentTypeItem[] = docsToTest.sort(compareUploadDates);
    expect(sortedDocsArray[0].value.uploadedDocument).toEqual(uploadedDoc);
    expect(sortedDocsArray[1].value.uploadedDocument).toEqual(uploadedDoc);
    expect(sortedDocsArray[2].value.uploadedDocument).toEqual(uploadedDoc2);
    expect(sortedDocsArray[3].value.uploadedDocument).toEqual(uploadedDoc2);
    expect(sortedDocsArray[4].value.uploadedDocument).toEqual(uploadedDoc3);
  });

  it('returns an empty map if no documents are provided', () => {
    const sortedMapEmpty = createSortedDocumentsMap([]);

    expect(sortedMapEmpty.size).toBe(4);
    expect(sortedMapEmpty.get(AllDocumentTypes.ACAS_CERT)).toEqual([]);
    expect(sortedMapEmpty.get(AllDocumentTypes.CLAIMANT_CORRESPONDENCE)).toEqual([]);
    expect(sortedMapEmpty.get(AllDocumentTypes.RESPONDENT_CORRESPONDENCE)).toEqual([]);
    expect(sortedMapEmpty.get(AllDocumentTypes.TRIBUNAL_CORRESPONDENCE)).toEqual([]);
  });

  it('should filter respondentes documents', () => {
    const result = filterRespondentsDocuments(docs, caseWithGenericTseApplications);
    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual('3');
    expect(result[1].id).toEqual('4');
  });

  it('should prepare table rows', () => {
    const tableRows = prepareTableRows(sortedMap, translationJsons, caseWithGenericTseApplications);
    expect(tableRows).toHaveLength(3);
    expect(tableRows[0].caption).toEqual('Acas documents');
    expect(tableRows[1].caption).toEqual('Claimant documents');
    expect(tableRows[2].caption).toEqual('Respondent documents');
  });

  it('isBundlesDoc should returns true when id matches an existing bundle doc', () => {
    const request = mockRequest({});
    request.session.userCase.bundleDocuments = bundleDocuments;
    request.session.documentDownloadPage = '/all-documents';
    const result = isBundlesDoc(request, '123');
    expect(result).toBe(true);
  });
  it('isBundlesDoc should return false when id not found', () => {
    const request = mockRequest({});
    request.session.userCase.bundleDocuments = bundleDocuments;
    request.session.documentDownloadPage = '/all-documents';
    const result = isBundlesDoc(request, '321');
    expect(result).toBe(false);
  });
  it('isBundlesDoc should return false when not on the all documents page', () => {
    const request = mockRequest({});
    request.session.userCase.bundleDocuments = bundleDocuments;
    request.session.documentDownloadPage = '/another-url';
    const result = isBundlesDoc(request, '123');
    expect(result).toBe(false);
  });
  it('isBundlesDoc should return false when bundles documents are undefined', () => {
    const request = mockRequest({});
    request.session.userCase.bundleDocuments = undefined;
    request.session.documentDownloadPage = '/all-documents';
    const result = isBundlesDoc(request, '123');
    expect(result).toBe(false);
  });
});
