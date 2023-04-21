import { AxiosResponse } from 'axios';

import { CaseWithId } from '../../definitions/case';
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
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'doc':
      return 'application/msword';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'csv':
      return 'text/csv';
    case 'gz':
      return 'application/gzip';
    case 'gif':
      return 'image/gif';
    case 'jpeg':
      return 'image/jpeg';
    case 'jpg':
      return 'image/jpeg';
    case 'mp3':
      return 'audio/mpeg';
    case 'mp4':
      return 'video/mp4';
    case 'mpeg':
      return 'video/mpeg';
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
    case 'tar':
      return 'application/x-tar';
    case 'txt':
      return 'text/plain';
    case 'wav':
      return 'audio/wav';
    case 'weba':
      return 'audio/webm';
    case 'webm':
      return 'video/webm';
    case 'webp':
      return 'image/webp';
    case 'zip':
      return 'application/zip';
    case '3gp':
      return 'video/3gpp';
    case '3g2':
      return 'video/3gpp2';
    case '7z':
      return 'application/x-7z-compressed';
    default:
      return undefined;
  }
};

export const findContentTypeByDocumentDetail = (documentDetail: DocumentDetail): string => {
  if (documentDetail.originalDocumentName) {
    return documentDetail.mimeType
      ? documentDetail.mimeType
      : findDocumentMimeTypeByExtension(
          documentDetail.originalDocumentName
            ?.substring(documentDetail.originalDocumentName.indexOf('.') + 1)
            ?.toLowerCase()
        );
  } else {
    return documentDetail.mimeType
      ? documentDetail.mimeType
      : undefined;
  }
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
