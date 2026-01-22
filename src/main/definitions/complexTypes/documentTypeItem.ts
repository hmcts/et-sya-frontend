import { Document } from '../case';

export interface DocumentTypeItem {
  id?: string;
  value?: DocumentType;
  //Custom field for visualization only
  downloadLink?: string;
}

export interface DocumentType {
  shortDescription?: string;
  uploadedDocument?: Document;
  typeOfDocument?: string;
  documentType?: string;
  creationDate?: string;
  dateOfCorrespondence?: string;
}
