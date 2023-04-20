import { AxiosResponse } from 'axios';

import { CaseWithId } from '../../definitions/case';
import { DOCUMENT_CONTENT_TYPES } from '../../definitions/constants';
import { DocumentDetail } from '../../definitions/definition';
import { getCaseApi } from '../../services/CaseService';

export const getDocumentDetails = async (documents: DocumentDetail[], accessToken: string): Promise<void> => {
  for await (const document of documents) {
    const docDetails = await getCaseApi(accessToken).getDocumentDetails(document.id);
    const { createdOn, size, mimeType, originalDocumentName } = docDetails.data;
    const retrievedValues = {
      size: (size / 1000000).toFixed(3),
      mimeType,
      originalDocumentName,
      createdOn: new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(createdOn)),
      description: document.description,
    };
    Object.assign(
      documents.find(doc => doc.id === document.id),
      retrievedValues
    );
  }
};

// merge arrays but make sure they are not undefined
export const combineDocuments = (...arrays: DocumentDetail[][]): DocumentDetail[] =>
  [].concat(...arrays.filter(Array.isArray)).filter(doc => doc !== undefined);

export const combineUserCaseDocuments = (userCases: CaseWithId[]): DocumentDetail[] => {
  const combinedDocuments: DocumentDetail[] = [];
  userCases?.forEach(userCase => {
    combinedDocuments.push(userCase.et1SubmittedForm);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.acknowledgementOfClaimLetterDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.rejectionOfClaimDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseAcknowledgementDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseRejectionDocumentDetail);
    if (userCase.claimSummaryFile?.document_url) {
      const document_url = userCase.claimSummaryFile.document_url;
      const documentId = document_url?.substring(document_url?.lastIndexOf('/') + 1);
      const claimSummaryFileDetail: DocumentDetail = {
        description: 'Claim Summary File Detail',
        id: documentId,
        originalDocumentName: userCase.claimSummaryFile.document_filename,
      };
      combinedDocuments.push(claimSummaryFileDetail);
    }
  });
  return combinedDocuments;
};

function pushDocumentsToCombinedDocuments(combinedDocuments: DocumentDetail[], documentDetailsList: DocumentDetail[]) {
  documentDetailsList?.forEach(documentDetail => combinedDocuments.push(documentDetail));
}

export const findDocumentMimeTypeByExtension = (extension: string): string => {
  switch (extension) {
    case 'docx':
      return DOCUMENT_CONTENT_TYPES.DOCX;
    case 'xlsx':
      return DOCUMENT_CONTENT_TYPES.XLSX;
    case 'pptx':
      return DOCUMENT_CONTENT_TYPES.PPTX;
    case 'doc':
      return DOCUMENT_CONTENT_TYPES.DOC;
    case 'xls':
      return DOCUMENT_CONTENT_TYPES.XLS;
    case 'ppt':
      return DOCUMENT_CONTENT_TYPES.PPT;
    case 'csv':
      return DOCUMENT_CONTENT_TYPES.CSV;
    case 'gz':
      return DOCUMENT_CONTENT_TYPES.GZ;
    case 'gif':
      return DOCUMENT_CONTENT_TYPES.GIF;
    case 'jpeg':
      return DOCUMENT_CONTENT_TYPES.JPEG;
    case 'jpg':
      return DOCUMENT_CONTENT_TYPES.JPG;
    case 'mp3':
      return DOCUMENT_CONTENT_TYPES.MP3;
    case 'mp4':
      return DOCUMENT_CONTENT_TYPES.MP4;
    case 'mpeg':
      return DOCUMENT_CONTENT_TYPES.MPEG;
    case 'png':
      return DOCUMENT_CONTENT_TYPES.PNG;
    case 'pdf':
      return DOCUMENT_CONTENT_TYPES.PDF;
    case 'tar':
      return DOCUMENT_CONTENT_TYPES.TAR;
    case 'txt':
      return DOCUMENT_CONTENT_TYPES.TXT;
    case 'wav':
      return DOCUMENT_CONTENT_TYPES.WAV;
    case 'weba':
      return DOCUMENT_CONTENT_TYPES.WEBA;
    case 'webm':
      return DOCUMENT_CONTENT_TYPES.WEBM;
    case 'webp':
      return DOCUMENT_CONTENT_TYPES.WEBP;
    case 'zip':
      return DOCUMENT_CONTENT_TYPES.ZIP;
    case '3gp':
      return DOCUMENT_CONTENT_TYPES._3GP;
    case '3g2':
      return DOCUMENT_CONTENT_TYPES._3G2;
    case '7z':
      return DOCUMENT_CONTENT_TYPES._7Z;
    default:
      return undefined;
  }
};

export const findContentTypeByDocumentDetail = (documentDetail: DocumentDetail): string => {
  let contentType = documentDetail.mimeType;
  if (!contentType && documentDetail.originalDocumentName) {
    const originalDocumentExtension = documentDetail.originalDocumentName
      .substring(documentDetail.originalDocumentName.indexOf('.') + 1)
      ?.toLowerCase();
    contentType = findDocumentMimeTypeByExtension(originalDocumentExtension);
  }
  return contentType;
};

export const findContentTypeByDocument = (document: AxiosResponse): string => {
  let contentType = document.headers['content-type'];
  if (!contentType) {
    let fileName: string = document?.headers?.originalfilename;
    if (!fileName) {
      const contentDisposition = document.headers['content-disposition'];
      fileName = contentDisposition?.substring(
        contentDisposition?.indexOf('"') + 1,
        contentDisposition?.lastIndexOf('"')
      );
    }
    const fileExtension = fileName?.substring(fileName.indexOf('.') + 1)?.toLowerCase();
    contentType = findDocumentMimeTypeByExtension(fileExtension);
  }
  return contentType;
};
