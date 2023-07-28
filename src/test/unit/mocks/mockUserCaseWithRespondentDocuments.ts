import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { Applicant } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';

export const uploadedDoc = {
  document_url: 'uuid1',
  document_filename: 'mockTypeOfDocument',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
};

export const uploadedDoc2 = {
  document_url: 'uuid2',
  document_filename: 'mockTypeOfDocument',
  document_binary_url: 'mockCreationDate',
  createdOn: 'Test date',
};

export const caseWithGenericTseApplications: CaseWithId = {
  id: '1234',
  state: CaseState.SUBMITTED,
  createdDate: 'today',
  lastModified: 'today',
  genericTseApplicationCollection: [
    {
      id: '124',
      value: {
        applicant: Applicant.RESPONDENT,
        date: '2019-05-02',
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        status: 'inProgress',
        documentUpload: uploadedDoc,
        type: 'Order a witness to attend to give evidence',
      },
    },
    {
      id: '125',
      value: {
        applicant: Applicant.RESPONDENT,
        date: '2019-05-02',
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        status: 'inProgress',
        documentUpload: undefined,
        type: 'Order a witness to attend to give evidence',
      },
    },
    {
      id: '126',
      value: {
        applicant: Applicant.RESPONDENT,
        date: '2019-05-02',
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        status: 'inProgress',
        documentUpload: uploadedDoc,
        type: 'Amend response',
      },
    },
  ],
};
