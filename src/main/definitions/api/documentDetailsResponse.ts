export interface DocumentDetailsResponse {
  classification: string;
  size: number;
  mimeType: string;
  originalDocumentName: string;
  createdOn: string;
  createdBy: string;
  lastModifiedBy: string;
  modifiedOn: string;
  metadata: {
    jurisdiction: string;
    case_id: string;
    case_type_id: string;
  };
}
