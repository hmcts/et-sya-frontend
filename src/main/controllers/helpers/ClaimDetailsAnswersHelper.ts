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
export const getClaimDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const claimDetails = [];

  claimDetails.push({
    key: {
      text: translations.claimDetails.header,
      classes: 'govuk-summary-list__key govuk-heading-m',
    },
    value: {},
  });

  if (userCase?.claimTypeDiscrimination) {
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

  if (userCase?.claimTypePay) {
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
      userCase?.tellUsWhatYouWant?.map(type => translations.tellUsWhatYouWant[type]).join('<br>') ??
        translations.notProvided,
      createChangeAction(
        PageUrls.CLAIM_TYPE_PAY + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.claimDetails.ifClaimSuccessful
      )
    )
  );

  if (userCase.tellUsWhatYouWant?.includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
    claimDetails.push(
      addSummaryRow(
        translations.claimDetails.expectedCompensation,
        (userCase.compensationOutcome ?? translations.notProvided) +
          ': ' +
          (userCase.compensationAmount ?? translations.notProvided),
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
        (userCase.whistleblowingClaim ?? translations.notProvided) +
          ' - ' +
          (userCase.whistleblowingEntityName ?? translations.notProvided),
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
      userCase.linkedCases ?? translations.notProvided,
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
