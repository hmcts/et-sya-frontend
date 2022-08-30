export interface DocumentUploadResponse {
  uri: string;
  classification: string;
  size: string;
  mimeType: string;
  originalDocumentName: string;
  hashToken: string;
  createdOn: string;
  createdBy: string;
  lastModifiedBy: string;
  modifiedOn: string;
  ttl: string;
  metadata: {
    case_type_id: string;
    jurisdiction: string;
  };
  _links: {
    self: {
      href: string;
    };
    binary: {
      href: string;
    };
  };
}
