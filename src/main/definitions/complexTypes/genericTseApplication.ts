import { Document } from '../case';

export interface GenericTseApplication {
  type: string;
  details: string;
  documentUpload: Document;
  copyToOtherPartyYesOrNo: string;
  copyToOtherPartyText: string;
}
