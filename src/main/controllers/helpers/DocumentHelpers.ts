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
      createdOn: new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(createdOn)),
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
  userCases.forEach(userCase => {
    if (userCase.et1SubmittedForm) {
      if (userCase.et1SubmittedForm && userCase.et1SubmittedForm.id) {
        combinedDocuments.push(userCase.et1SubmittedForm);
      }
      if (userCase.acknowledgementOfClaimLetterDetail) {
        userCase.acknowledgementOfClaimLetterDetail.forEach(acknowledgementOfClaimLetterDetailItem => {
          if (acknowledgementOfClaimLetterDetailItem.id) {
            combinedDocuments.push(acknowledgementOfClaimLetterDetailItem);
          }
        });
      }
      if (userCase.rejectionOfClaimDocumentDetail) {
        userCase.rejectionOfClaimDocumentDetail.forEach(rejectionOfClaimDocumentDetailItem => {
          if (rejectionOfClaimDocumentDetailItem.id) {
            combinedDocuments.push(rejectionOfClaimDocumentDetailItem);
          }
        });
      }
      if (userCase.responseAcknowledgementDocumentDetail) {
        userCase.responseAcknowledgementDocumentDetail.forEach(responseAcknowledgementDocumentDetailItem => {
          if (responseAcknowledgementDocumentDetailItem.id) {
            combinedDocuments.push(responseAcknowledgementDocumentDetailItem);
          }
        });
      }
      if (userCase.responseRejectionDocumentDetail) {
        userCase.responseRejectionDocumentDetail.forEach(responseRejectionDocumentDetailItem => {
          if (responseRejectionDocumentDetailItem.id) {
            combinedDocuments.push(responseRejectionDocumentDetailItem);
          }
        });
      }
      if (userCase.responseEt3FormDocumentDetail) {
        userCase.responseEt3FormDocumentDetail.forEach(responseEt3FormDocumentDetailItem => {
          if (responseEt3FormDocumentDetailItem.id) {
            combinedDocuments.push(responseEt3FormDocumentDetailItem);
          }
        });
      }
    }
  });
  return combinedDocuments;
};
