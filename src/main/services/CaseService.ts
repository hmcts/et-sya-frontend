import axios from 'axios';
import config from 'config';

export interface initiateCaseDraftResponse {
  id: number;
  jurisdiction: string;
  state: string;
  case_type_id: string;
  created_date: Date;
  last_modified: Date;
  locked_by_user_id: null;
  security_level: null;
  case_data: CaseData;
  security_classification: string;
  callback_response_status: null;
}

export interface CaseData {
  case_type?: string;
  case_source?: string;
}

export const createCase = async (caseType: string, accessToken: string): Promise<initiateCaseDraftResponse> => {
  const conf = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const body = {
    case_type: caseType,
    case_source: '',
  };

  const syaApiHost: string = config.get('services.etSyaApi.host');

  return axios.post(`${syaApiHost}/case-type/ET_EnglandWales/event-type/initiateCaseDraft/case`, body, conf);
};
