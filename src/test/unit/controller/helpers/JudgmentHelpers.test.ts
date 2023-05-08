import {
  activateJudgmentsLink,
  populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors,
} from '../../../../main/controllers/helpers/JudgmentHelpers';
import { Document } from '../../../../main/definitions/case';
import {
  TseAdminDecision,
  TseAdminDecisionItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import {
  DocumentType,
  DocumentTypeItem,
  SendNotificationType,
  SendNotificationTypeItem,
} from '../../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { Parties, ResponseRequired, TranslationKeys } from '../../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../../main/definitions/hub';
import { AnyRecord } from '../../../../main/definitions/util-types';
import allJudgmentsRaw from '../../../../main/resources/locales/en/translation/all-judgments.json';
import citizenHubRaw from '../../../../main/resources/locales/en/translation/citizen-hub.json';
import judgmentDetailsRaw from '../../../../main/resources/locales/en/translation/judgment-details.json';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Judgment helper', () => {
  const translationJsons = { ...judgmentDetailsRaw, ...allJudgmentsRaw, ...citizenHubRaw };
  const req = mockRequestWithTranslation({}, translationJsons);

  const doc: Document = {
    document_url: 'uuid',
    document_filename: 'test.pdf',
    document_binary_url: '',
    document_size: 1000,
    document_mime_type: 'pdf',
  };

  const docType = {
    shortDescription: 'Short description',
    uploadedDocument: doc,
  } as DocumentType;

  const docItem = {
    value: docType,
  } as DocumentTypeItem;

  const notificationType = {
    number: '1',
    sendNotificationSelectHearing: {
      selectedLabel: 'Hearing',
    },
    date: '2019-05-02',
    sentBy: 'Tribunal',
    sendNotificationSubjectString: 'Judgment',
    sendNotificationResponseTribunal: 'Required',
    sendNotificationSelectParties: 'Both',
    sendNotificationAdditionalInfo: 'Additional info',
    sendNotificationUploadDocument: [docItem],
    sendNotificationWhoCaseOrder: 'Judge',
    sendNotificationFullName: 'Bob',
    sendNotificationNotify: 'Both',
    notificationState: 'notStartedYet',
  } as SendNotificationType;

  const notificationItem = {
    id: '2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28',
    value: notificationType,
  } as SendNotificationTypeItem;

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.JUDGMENT_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.ALL_JUDGMENTS, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
  };

  it('should activate judgments link', () => {
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    const notification = {
      value: {
        sendNotificationSubjectString: 'Judgment',
        sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
        sendNotificationResponseTribunal: ResponseRequired.YES,
      } as SendNotificationType,
    } as SendNotificationTypeItem;

    const decision = {
      value: {
        date: '3 March 2023',
        decision: 'Granted',
        decisionMadeBy: 'Judge',
        decisionMadeByFullName: 'Mr Judgey',
        typeOfDecision: 'Judgment',
        selectPartyNotify: 'Both parties',
        additionalInformation: 'Additional info 1 test text',
        enterNotificationTitle: 'Decision title 1 test text',
      } as TseAdminDecision,
    } as TseAdminDecisionItem;

    activateJudgmentsLink([notification], [decision], request);
  });

  it('should populate notification with redirect link, status and color', () => {
    const populatedNotification = populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors(
      [notificationItem],
      'url',
      translations
    )[0];
    expect(populatedNotification.redirectUrl).toEqual('/judgment-details/2c6ae9f6-66cd-4a6b-86fa-0eabcb64bf28?lng=en');
    expect(populatedNotification.statusColor).toEqual('--red');
    expect(populatedNotification.displayStatus).toEqual('Not started yet');
  });
});
