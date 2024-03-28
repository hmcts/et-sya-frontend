import {
  findSelectedPseResponse,
  findSelectedSendNotification,
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
      respondCollection: pseResponseType,
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
    const actual = findSelectedPseResponse(sendNotificationTypeItem[0], '23456');
    expect(actual).toEqual(expected);
  });
});
