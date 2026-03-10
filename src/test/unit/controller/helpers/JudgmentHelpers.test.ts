import { createDownloadLink } from '../../../../main/controllers/helpers/DocumentHelpers';
import {
  activateJudgmentsLink,
  getAllAppsWithDecisions,
  getDecisionAttachments,
  getDecisionDetails,
  getDecisions,
  getJudgmentAttachments,
  populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors,
  populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors,
} from '../../../../main/controllers/helpers/JudgmentHelpers';
import { YesOrNo } from '../../../../main/definitions/case';
import { DocumentTypeItem } from '../../../../main/definitions/complexTypes/documentTypeItem';
import {
  TseAdminDecision,
  TseAdminDecisionItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import {
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
import {
  caseWithDecisionsAndJudgments,
  decisionUploadedDoc1,
  decisionUploadedDoc2,
} from '../../mocks/mockUserCaseWithDecisionsAndJudgments';

describe('Judgment helper', () => {
  const translationJsons = { ...judgmentDetailsRaw, ...allJudgmentsRaw, ...citizenHubRaw };
  const req = mockRequestWithTranslation({}, translationJsons);

  const summaryListClass = 'govuk-!-font-weight-regular-m';

  const selectedDecision = {
    value: {
      date: '2022-05-05',
      decision: 'Granted',
      decisionMadeBy: 'Judge',
      decisionMadeByFullName: 'Mr Test Judge',
      typeOfDecision: 'Judgment',
      selectPartyNotify: 'Both parties',
      additionalInformation: 'Additional info 1 test text',
      enterNotificationTitle: 'Decision title 1 test text',
    } as TseAdminDecision,
  } as TseAdminDecisionItem;

  const decisionDocs: DocumentTypeItem[] = [
    {
      id: '1',
      value: {
        typeOfDocument: 'Decision document',
        shortDescription: 'Decision document 1',
        uploadedDocument: decisionUploadedDoc1,
      },
    },
    {
      id: '2',
      value: {
        typeOfDocument: 'Decision document',
        shortDescription: 'Decision document 2',
        uploadedDocument: decisionUploadedDoc2,
      },
    },
  ];

  const notification = {
    value: {
      sendNotificationSubjectString: 'Judgment',
      sendNotificationSelectParties: Parties.RESPONDENT_ONLY,
      sendNotificationResponseTribunal: ResponseRequired.YES,
    } as SendNotificationType,
  } as SendNotificationTypeItem;

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.JUDGMENT_DETAILS, { returnObjects: true }),
    ...req.t(TranslationKeys.ALL_JUDGMENTS, { returnObjects: true }),
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
  };

  it('should activate judgments link', () => {
    const request = mockRequest({});
    request.session.userCase.hubLinksStatuses = new HubLinksStatuses();

    activateJudgmentsLink([notification], [selectedDecision], request);
  });

  it('should populate judgments with redirect link, status and colour', () => {
    const populatedNotification = populateJudgmentItemsWithRedirectLinksCaptionsAndStatusColors(
      [caseWithDecisionsAndJudgments.sendNotificationCollection[0]],
      'url',
      translations
    )[0];
    expect(populatedNotification.redirectUrl).toEqual('/judgment-details/a07ec825-85ae-4041-81da-126de3ad7a60?lng=en');
    expect(populatedNotification.statusColor).toEqual('--red');
    expect(populatedNotification.displayStatus).toEqual('Not viewed yet');
  });

  it('should populate decisions with redirect link, status and colour', () => {
    const populatedJudgment = populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors(
      [caseWithDecisionsAndJudgments.genericTseApplicationCollection[0].value.adminDecision[0]],
      'url',
      translations
    )[0];
    expect(populatedJudgment.redirectUrl).toEqual('/judgment-details/1?lng=en');
    expect(populatedJudgment.statusColor).toEqual('--red');
    expect(populatedJudgment.displayStatus).toEqual('Not viewed yet');
  });

  it('should populate decisions with inProgress redirect link, status and colour', () => {
    const populatedJudgment = populateDecisionItemsWithRedirectLinksCaptionsAndStatusColors(
      [caseWithDecisionsAndJudgments.genericTseApplicationCollection[0].value.adminDecision[1]],
      'url',
      translations
    )[0];
    expect(populatedJudgment.redirectUrl).toEqual('/judgment-details/2?lng=en');
    expect(populatedJudgment.statusColor).toEqual('--yellow');
    expect(populatedJudgment.displayStatus).toEqual('In progress');
  });

  it('should get all apps with decisions', () => {
    const result = getAllAppsWithDecisions(caseWithDecisionsAndJudgments);
    expect(result).toHaveLength(1);
  });

  it('should get all decisions', () => {
    const result = getDecisions(caseWithDecisionsAndJudgments);
    expect(result).toHaveLength(2);
  });

  it('should return expected details content for a decision', () => {
    decisionDocs.forEach(it => (it.downloadLink = createDownloadLink(it.value.uploadedDocument)));
    const applicationCollection = caseWithDecisionsAndJudgments.genericTseApplicationCollection[0];
    const applicationDocDownloadLink = createDownloadLink(applicationCollection.value.documentUpload);
    const responseDocDownloadLink = createDownloadLink(
      applicationCollection.value.respondCollection[0].value.supportingMaterial[0].value.uploadedDocument
    );
    const pageContent = getDecisionDetails(
      caseWithDecisionsAndJudgments,
      applicationCollection.value.adminDecision[0],
      applicationDocDownloadLink,
      responseDocDownloadLink,
      decisionDocs,
      translations
    );

    expect(pageContent[0][0].key).toEqual({ classes: summaryListClass, text: translations.applicant });
    expect(pageContent[0][0].value).toEqual({ text: 'Respondent' });
    expect(pageContent[0][1].key).toEqual({ classes: summaryListClass, text: translations.applicationType });
    expect(pageContent[0][1].value).toEqual({ text: 'Amend my claim' });
    expect(pageContent[0][2].key).toEqual({ classes: summaryListClass, text: translations.applicationDate });
    expect(pageContent[0][2].value).toEqual({ text: '2022-05-05' });
    expect(pageContent[0][3].key).toEqual({ classes: summaryListClass, text: translations.legend });
    expect(pageContent[0][3].value).toEqual({ text: 'Test application details text' });
    expect(pageContent[0][4].key).toEqual({ classes: summaryListClass, text: translations.supportingMaterial });
    expect(pageContent[0][4].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid1' target='_blank' class='govuk-link'>mockApplicationDocumentUpload</a>",
    });
    expect(pageContent[0][5].key).toEqual({ classes: summaryListClass, text: translations.copyCorrespondence });
    expect(pageContent[0][5].value).toEqual({ text: YesOrNo.YES });

    expect(pageContent[1][0].key).toEqual({ classes: summaryListClass, text: translations.responseFrom });
    expect(pageContent[1][0].value).toEqual({ text: 'Respondent' });
    expect(pageContent[1][1].key).toEqual({ classes: summaryListClass, text: translations.date });
    expect(pageContent[1][1].value).toEqual({ html: '11 May 2023' });
    expect(pageContent[1][2].key).toEqual({
      classes: summaryListClass,
      text: translations.responsePart1 + "claimant's" + translations.responsePart2,
    });
    expect(pageContent[1][2].value).toEqual({ html: 'Test respondent response text' });
    expect(pageContent[1][3].key).toEqual({ classes: summaryListClass, text: translations.supportingMaterial });
    expect(pageContent[1][3].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid2' target='_blank' class='govuk-link'>mockResponseDocumentUpload</a>",
    });
    expect(pageContent[1][4].key).toEqual({ classes: summaryListClass, text: translations.copyCorrespondence });
    expect(pageContent[1][4].value).toEqual({ text: YesOrNo.YES });

    expect(pageContent[2][0].key).toEqual({ classes: summaryListClass, text: translations.decision });
    expect(pageContent[2][0].value).toEqual({ text: 'Test decision title' });
    expect(pageContent[2][1].key).toEqual({ classes: summaryListClass, text: translations.dateSent });
    expect(pageContent[2][1].value).toEqual({ text: '2022-05-05' });
    expect(pageContent[2][2].key).toEqual({ classes: summaryListClass, text: translations.sentBy });
    expect(pageContent[2][2].value).toEqual({ text: 'Judge' });
    expect(pageContent[2][3].key).toEqual({ classes: summaryListClass, text: translations.description });
    expect(pageContent[2][3].value).toEqual({ html: 'Decision document 1' });
    expect(pageContent[2][4].key).toEqual({ classes: summaryListClass, text: translations.document });
    expect(pageContent[2][4].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid3' target='_blank' class='govuk-link'>mockDecisionDocumentUpload1</a>",
    });
    expect(pageContent[2][5].key).toEqual({ classes: summaryListClass, text: translations.description });
    expect(pageContent[2][5].value).toEqual({ html: 'Decision document 2' });
    expect(pageContent[2][6].key).toEqual({ classes: summaryListClass, text: translations.document });
    expect(pageContent[2][6].value).toEqual({
      html: "<a href='/getSupportingMaterial/uuid4' target='_blank' class='govuk-link'>mockDecisionDocumentUpload2</a>",
    });
    expect(pageContent[2][7].key).toEqual({ classes: summaryListClass, text: translations.decisionMadeBy });
    expect(pageContent[2][7].value).toEqual({ text: 'Judge' });
    expect(pageContent[2][8].key).toEqual({ classes: summaryListClass, text: translations.name });
    expect(pageContent[2][8].value).toEqual({ text: 'Mr Test Judge' });
    expect(pageContent[2][9].key).toEqual({ classes: summaryListClass, text: translations.sentTo });
    expect(pageContent[2][9].value).toEqual({ text: 'Both parties' });
  });

  it('should get judgment attachments with download links', () => {
    const judgment: SendNotificationTypeItem = {
      id: '1',
      value: {
        sendNotificationUploadDocument: [
          {
            id: '1',
            value: {
              typeOfDocument: 'Judgment document',
              uploadedDocument: decisionUploadedDoc1,
            },
          },
          {
            id: '2',
            value: {
              typeOfDocument: 'Supporting document',
              shortDescription: 'Already has description',
              uploadedDocument: decisionUploadedDoc2,
            },
          },
        ],
      } as SendNotificationType,
    };

    const attachments = getJudgmentAttachments(judgment);

    expect(attachments).toHaveLength(2);
    expect(attachments[0].value.shortDescription).toBe('Judgment document');
    expect(attachments[0].downloadLink).toContain('mockDecisionDocumentUpload1');
    expect(attachments[1].value.shortDescription).toBe('Already has description');
    expect(attachments[1].downloadLink).toContain('mockDecisionDocumentUpload2');
  });

  it('should return empty array when judgment has no attachments', () => {
    const judgment: SendNotificationTypeItem = {
      id: '1',
      value: {} as SendNotificationType,
    };

    const attachments = getJudgmentAttachments(judgment);

    expect(attachments).toEqual([]);
  });

  it('should get decision attachments with download links', () => {
    const decision: TseAdminDecisionItem = {
      id: '1',
      value: {
        responseRequiredDoc: [
          {
            id: '1',
            value: {
              typeOfDocument: 'Decision doc',
              uploadedDocument: decisionUploadedDoc1,
            },
          },
        ],
      } as TseAdminDecision,
    };

    const attachments = getDecisionAttachments(decision);

    expect(attachments).toHaveLength(1);
    expect(attachments[0].value.shortDescription).toBe('Decision doc');
    expect(attachments[0].downloadLink).toContain('mockDecisionDocumentUpload1');
  });

  it('should handle decision attachments without shortDescription', () => {
    const decision: TseAdminDecisionItem = {
      id: '1',
      value: {
        responseRequiredDoc: [
          {
            id: '1',
            value: {
              typeOfDocument: 'My Type',
              uploadedDocument: decisionUploadedDoc1,
            },
          },
        ],
      } as TseAdminDecision,
    };

    const attachments = getDecisionAttachments(decision);

    expect(attachments[0].value.shortDescription).toBe('My Type');
  });
});
