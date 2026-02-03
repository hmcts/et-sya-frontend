import {
  compareUploadDates,
  isBundlesDoc,
  isDocInPseRespondCollection,
} from '../../../../main/controllers/helpers/AllDocumentsHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { DocumentTypeItem } from '../../../../main/definitions/complexTypes/documentTypeItem';
import { SendNotificationTypeItem } from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { uploadedDoc, uploadedDoc2, uploadedDoc3 } from '../../mocks/mockUserCaseWithRespondentDocuments';

describe('allDocumentsHelper tests', () => {
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

  it('returns a sorted array of documents', () => {
    const sortedDocsArray: DocumentTypeItem[] = docsToTest.sort(compareUploadDates);
    expect(sortedDocsArray[0].value.uploadedDocument).toEqual(uploadedDoc);
    expect(sortedDocsArray[1].value.uploadedDocument).toEqual(uploadedDoc);
    expect(sortedDocsArray[2].value.uploadedDocument).toEqual(uploadedDoc2);
    expect(sortedDocsArray[3].value.uploadedDocument).toEqual(uploadedDoc2);
    expect(sortedDocsArray[4].value.uploadedDocument).toEqual(uploadedDoc3);
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

describe('isDocInPseRespondCollection tests', () => {
  const supportingMaterial: DocumentTypeItem[] = [
    {
      id: '9490460c-3588-4974-b102-75a91ccc8e0e',
      value: {
        uploadedDocument: {
          document_filename: 'TEST.txt',
          document_url: 'http://localhost:5005/documents/fd7bdb86-8ba6-4bfc-9c45-9b0679cb155a',
          document_binary_url: 'http://localhost:5005/documents/fd7bdb86-8ba6-4bfc-9c45-9b0679cb155a/binary',
        },
      },
    },
  ];

  const sendNotificationTypeItem: SendNotificationTypeItem[] = [
    {
      id: '12345',
      value: {
        number: '1',
        respondCollection: [
          {
            id: '23456',
            value: {
              from: Applicant.CLAIMANT,
              copyToOtherParty: YesOrNo.YES,
              supportingMaterial,
            },
          },
        ],
      },
    },
  ];

  const request = mockRequest({});
  request.session.userCase.sendNotificationCollection = sendNotificationTypeItem;

  it('isDocInPseRespondCollection should return true', () => {
    const result = isDocInPseRespondCollection(request, 'fd7bdb86-8ba6-4bfc-9c45-9b0679cb155a');
    expect(result).toBe(true);
  });

  it('isDocInPseRespondCollection should return false when uploadedDocument undefined', () => {
    request.session.userCase.sendNotificationCollection[0].value.respondCollection[0].value.supportingMaterial[0].value.uploadedDocument =
      undefined;
    const result = isDocInPseRespondCollection(request, '123');
    expect(result).toBe(false);
  });

  it('isDocInPseRespondCollection should return false when supportingMaterial undefined', () => {
    request.session.userCase.sendNotificationCollection[0].value.respondCollection[0].value.supportingMaterial =
      undefined;
    const result = isDocInPseRespondCollection(request, '123');
    expect(result).toBe(false);
  });

  it('isDocInPseRespondCollection should return false when respondCollection undefined', () => {
    request.session.userCase.sendNotificationCollection[0].value.respondCollection = undefined;
    const result = isDocInPseRespondCollection(request, '123');
    expect(result).toBe(false);
  });

  it('isDocInPseRespondCollection should return false when sendNotificationCollection undefined', () => {
    request.session.userCase.sendNotificationCollection = undefined;
    const result = isDocInPseRespondCollection(request, '123');
    expect(result).toBe(false);
  });

  it('isDocInPseRespondCollection should return false when userCase undefined', () => {
    request.session.userCase = undefined;
    const result = isDocInPseRespondCollection(request, '123');
    expect(result).toBe(false);
  });
});
