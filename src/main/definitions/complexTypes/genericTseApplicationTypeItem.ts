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
  status?: string;
  applicationState?: string;
  dueDate?: string;
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
}

export const sortByDate = (a: GenericTseApplicationTypeItem, b: GenericTseApplicationTypeItem): number => {
  const da = new Date(a.value.date),
    db = new Date(b.value.date);
  return da.valueOf() - db.valueOf();
};
