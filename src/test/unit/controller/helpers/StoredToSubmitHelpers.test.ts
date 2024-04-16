import {
  findSelectedPseResponse,
  findSelectedSendNotification,
  putSelectedAppToUserCase,
} from '../../../../main/controllers/helpers/StoredToSubmitHelpers';
import { YesOrNo } from '../../../../main/definitions/case';
import {
  PseResponseType,
  SendNotificationTypeItem,
} from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { TypeItem } from '../../../../main/definitions/util-types';
import { mockRequest } from '../../mocks/mockRequest';

const pseResponseType: TypeItem<PseResponseType>[] = [
  {
    id: '23456',
    value: {
      from: Applicant.CLAIMANT,
      copyToOtherParty: YesOrNo.YES,
    },
  },
];

const sendNotificationTypeItem: SendNotificationTypeItem[] = [
  {
    id: '12345',
    value: {
      number: '1',
      respondStoredCollection: pseResponseType,
    },
  },
];

describe('findSelectedSendNotification', () => {
  const req = mockRequest({});
  req.session.userCase.sendNotificationCollection = sendNotificationTypeItem;

  it('should return selected Send Notification', () => {
    const expected = sendNotificationTypeItem[0];
    const actual = findSelectedSendNotification(sendNotificationTypeItem, '12345');
    expect(actual).toEqual(expected);
  });
});

describe('findSelectedPseResponse', () => {
  const req = mockRequest({});
  req.session.userCase.sendNotificationCollection = sendNotificationTypeItem;

  it('should return selected Pse Response', () => {
    const expected = pseResponseType[0];
    const actual = findSelectedPseResponse(sendNotificationTypeItem[0].value.respondStoredCollection, '23456');
    expect(actual).toEqual(expected);
  });
});

describe('putSelectedAppToUserCase', () => {
  it('should return userCase with selectedGenericTseApplication mapping', () => {
    const req = mockRequest({});
    const userCase = req.session.userCase;
    const testDoc1 = {
      document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
      document_filename: 'testDoc1.pdf',
      document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
    };
    userCase.selectedGenericTseApplication = {
      id: '23456',
      value: {
        applicant: Applicant.CLAIMANT,
        date: '2 March 2023',
        type: 'Change my personal details',
        details: 'details text',
        documentUpload: testDoc1,
        copyToOtherPartyYesOrNo: YesOrNo.YES,
      },
    };

    putSelectedAppToUserCase(userCase);
    expect(userCase.contactApplicationType).toEqual('change-details');
    expect(userCase.contactApplicationText).toEqual('details text');
    expect(userCase.contactApplicationFile).toEqual(testDoc1);
    expect(userCase.copyToOtherPartyYesOrNo).toEqual(YesOrNo.YES);
    expect(userCase.copyToOtherPartyText).toEqual(undefined);
  });
});
