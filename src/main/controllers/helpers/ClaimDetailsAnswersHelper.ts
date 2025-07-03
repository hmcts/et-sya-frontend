import { CaseWithId, YesOrNo } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../definitions/definition';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

const getTranslationsCompensationOutcome = (userCase: CaseWithId, translations: AnyRecord): string => {
  if (userCase.compensationOutcome && userCase.compensationAmount) {
    return userCase.compensationOutcome + '<br>£' + userCase.compensationAmount;
  } else if (userCase.compensationOutcome) {
    return userCase.compensationOutcome;
  } else if (userCase.compensationAmount) {
    return '£' + userCase.compensationAmount;
  } else {
    return translations.notProvided;
  }
};

const getTranslationsWhistleblowingClaim = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.whistleblowingClaim) {
    case YesOrNo.YES:
      return translations.doYesOrNo.yes + ' - ' + userCase.whistleblowingEntityName;
    case YesOrNo.NO:
      return translations.doYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

const getTranslationsLinkedCases = (linkedCases: YesOrNo, translations: AnyRecord): string => {
  switch (linkedCases) {
    case YesOrNo.YES:
      return translations.doYesOrNo.yes;
    case YesOrNo.NO:
      return translations.doYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

export const getClaimDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const claimDetails = [];

  claimDetails.push({
    key: {
      text: translations.claimDetails.header,
      classes: 'govuk-summary-list__key govuk-heading-m',
    },
    value: {},
  });

  if (userCase.typeOfClaim?.includes(TypesOfClaim.DISCRIMINATION)) {
    claimDetails.push(
      addSummaryHtmlRow(
        translations.claimDetails.claimTypeDiscrimination,
        userCase.claimTypeDiscrimination.map(type => translations.discriminationClaims[type]).join('<br>'),
        createChangeAction(
          PageUrls.CLAIM_TYPE_DISCRIMINATION + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.claimTypeDiscrimination
        )
      )
    );
  }

  if (userCase.typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM)) {
    claimDetails.push(
      addSummaryHtmlRow(
        translations.claimDetails.claimTypePay,
        userCase.claimTypePay.map(type => translations.payClaims[type]).join('<br>'),
        createChangeAction(
          PageUrls.CLAIM_TYPE_PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.claimTypePay
        )
      )
    );
  }

  claimDetails.push(
    addSummaryRow(
      translations.claimDetails.describeWhatHappened,
      userCase.claimSummaryText ?? translations.notProvided,
      createChangeAction(
        PageUrls.DESCRIBE_WHAT_HAPPENED + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.describeWhatHappened
      )
    )
  );

  claimDetails.push(
    addSummaryHtmlRow(
      translations.claimDetails.ifClaimSuccessful,
      userCase.tellUsWhatYouWant?.map(type => translations.tellUsWhatYouWant[type]).join('<br>') ??
        translations.notProvided,
      createChangeAction(
        PageUrls.TELL_US_WHAT_YOU_WANT + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.ifClaimSuccessful
      )
    )
  );

  if (userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
    claimDetails.push(
      addSummaryRow(
        translations.claimDetails.expectedCompensation,
        getTranslationsCompensationOutcome(userCase, translations),
        createChangeAction(
          PageUrls.COMPENSATION + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.expectedCompensation
        )
      )
    );
  }

  if (userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
    claimDetails.push(
      addSummaryRow(
        translations.claimDetails.expectedTribunalsRecommendation,
        userCase.tribunalRecommendationRequest ?? translations.notProvided,
        createChangeAction(
          PageUrls.TRIBUNAL_RECOMMENDATION + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.tribunalRecommendationRequest
        )
      )
    );
  }

  if (userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING)) {
    claimDetails.push(
      addSummaryRow(
        translations.claimDetails.forwardClaim,
        getTranslationsWhistleblowingClaim(userCase, translations),
        createChangeAction(
          PageUrls.WHISTLEBLOWING_CLAIMS + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.forwardClaim
        )
      )
    );
  }

  claimDetails.push(
    addSummaryRow(
      translations.claimDetails.linkedCases,
      getTranslationsLinkedCases(userCase.linkedCases, translations),
      createChangeAction(
        PageUrls.LINKED_CASES + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.linkedCases
      )
    )
  );

  if (userCase.linkedCases?.includes(YesOrNo.YES)) {
    claimDetails.push(
      addSummaryRow(
        translations.claimDetails.linkedCasesDetail,
        userCase.linkedCasesDetail ?? translations.notProvided,
        createChangeAction(
          PageUrls.LINKED_CASES + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.claimDetails.linkedCasesDetail
        )
      )
    );
  }

  return claimDetails;
};
