import { Document } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
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

export const getDocumentAdditionalInformation = async (doc: Document, accessToken: string): Promise<Document> => {
  const docId = doc.document_url.replace(/.*\//g, '');
  const docDetails = await getCaseApi(accessToken).getDocumentDetails(docId);
  const { size, mimeType } = docDetails.data;
  doc.document_mime_type = mimeType;
  doc.document_size = size / 1000000;
  return doc;
};

// merge arrays but make sure they are not undefined
export const combineDocuments = (...arrays: DocumentDetail[][]): DocumentDetail[] =>
  [].concat(...arrays.filter(Array.isArray)).filter(doc => doc !== undefined);

export const createDownloadLink = (file: Document): string => {
  let downloadLink = '';
  if (file && file.document_size && file.document_mime_type && file.document_filename) {
    downloadLink =
      "<a href='/getSupportingMaterial' target='_blank' class='govuk-link'>" +
      file.document_filename +
      '(' +
      file.document_mime_type +
      ', ' +
      file.document_size +
      'MB)' +
      '</a>';
  }
  return downloadLink;
};

export const findSelectedGenericTseApplication = (
  items: GenericTseApplicationTypeItem[],
  param: string
): GenericTseApplicationTypeItem => {
  return items?.find(it => it.value.number === param);
};
