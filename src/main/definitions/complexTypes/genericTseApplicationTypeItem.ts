import { Document, YesOrNo } from '../case';

export interface GenericTseApplicationTypeItem {
  id?: string;
  value?: GenericTseApplicationType;
  //Field created for visualization only
  linkValue?: string;
  //Url for navigating used in et-sya-front only
  redirectUrl?: string;
  statusColor?: string;
  displayStatus?: string;
}

export interface GenericTseApplicationType {
  applicant?: string;
  date?: string;
  type?: string;
  copyToOtherPartyText?: string;
  copyToOtherPartyYesOrNo?: YesOrNo;
  details?: string;
  documentUpload?: Document;
  number?: string;
  respondCollection?: TseRespondTypeItem[];
  responsesCount?: string;
  status?: string;
  dueDate?: string;
  applicationState?: string;
  adminDecision?: TseAdminDecisionItem[];
}

export interface TseAdminDecisionItem {
  id?: string;
  value?: TseAdminDecision;
}

export interface TseAdminDecision {
  date?: string;
  decision?: string;
  decisionMadeBy?: string;
  typeOfDecision?: string;
  selectPartyNotify?: string;
  responseRequiredDoc?: Document;
  additionalInformation?: string;
  decisionMadeByFullName?: string;
  enterNotificationTitle?: string;
}

export interface TseRespondTypeItem {
  id?: string;
  value?: TseRespondType;
}

export interface TseRespondType {
  from?: string;
  date?: string;
  response?: string;
  copyToOtherParty?: string;
  hasSupportingMaterial?: YesOrNo;
  supportingMaterial?: TseRespondSupportingMaterialItem[];
}

export interface TseRespondSupportingMaterialItem {
  id?: string;
  value?: TseRespondSupportingMaterial;
}

export interface TseRespondSupportingMaterial {
  uploadedDocument?: Document;
}

export const sortByDate = (a: GenericTseApplicationTypeItem, b: GenericTseApplicationTypeItem): number => {
  const da = new Date(a.value.date),
    db = new Date(b.value.date);
  return da.valueOf() - db.valueOf();
};
