export interface GenericTseApplications {
  id: string;
  value: GenericTseApplicationTypeItem;
}

export interface GenericTseApplicationTypeItem {
  number: string;
  type: string;
  applicant: string;
  date: string;
  documentUpload: Document;
  details: string;
  copyToOtherPartyYesOrNo: string;
  copyToOtherPartyText: string;
  dueDate: string;
  responsesCount: string;
  status: string;
}
