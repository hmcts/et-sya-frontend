import { AddAdditionalClaimant, CaseType, CaseWithId, YesOrNo } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { formatAddress, formatDob, formatName } from './multiples/ReviewAdditionalClaimantsHelper';

const getTranslationsCaseType = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.caseType) {
    case CaseType.SINGLE:
      return translations.groupClaimDetails.single;
    case CaseType.MULTIPLE:
      return translations.groupClaimDetails.multiple;
    default:
      return translations.notProvided;
  }
};

const getTranslationsAdditionalClaimantMethod = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.addClaimantMethod) {
    case AddAdditionalClaimant.MANUAL:
      return translations.groupClaimDetails.manually;
    case AddAdditionalClaimant.SPREADSHEET:
      return translations.groupClaimDetails.spreadsheet;
    default:
      return translations.notProvided;
  }
};

const getTranslationsGroupRepresentative = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.leadClaimant) {
    case YesOrNo.YES:
      return translations.yes;
    case YesOrNo.NO:
      return translations.no;
    default:
      return translations.notProvided;
  }
};

function buildAdditionalClaimantCards(userCase: CaseWithId, translations: AnyRecord) {
  const claimants = userCase.additionalClaimants || [];

  if (claimants.length === 0) {
    return translations.notProvided;
  }

  // Loop through the claimants and construct the summary cards markup
  return claimants
    .map((claimant, index) => {
      return `
    <div class="govuk-summary-card govuk-!-margin-bottom-4">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">
          ${translations.groupClaimDetails.additionalClaimant}  ${index + 1}
        </h2>
      </div>
      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.nameLabel}</dt>
            <dd class="govuk-summary-list__value">${formatName(claimant)}</dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.emailLabel}</dt>
            <dd class="govuk-summary-list__value">${claimant.email || translations.notProvided}</dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.dobLabel}</dt>
            <dd class="govuk-summary-list__value">${formatDob(claimant.dob) || translations.notProvided}</dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.addressLabel}</dt>
            <dd class="govuk-summary-list__value">${formatAddress(claimant) || translations.notProvided}</dd>
          </div>
        </dl>
      </div>
    </div>
  `;
    })
    .join('');
}

export const getGroupClaimDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.groupClaimDetails.claimType,
      getTranslationsCaseType(userCase, translations),
      createChangeAction(
        PageUrls.SINGLE_OR_MULTIPLE_CLAIM + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.groupClaimDetails.claimType
      )
    )
  );

  if (userCase.caseType === CaseType.MULTIPLE) {
    rows.push(
      addSummaryRow(
        translations.groupClaimDetails.addAdditionalClaimantsMethod,
        getTranslationsAdditionalClaimantMethod(userCase, translations),
        createChangeAction(
          PageUrls.ADD_ANOTHER_CLAIMANT + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.groupClaimDetails.addAdditionalClaimantsMethod
        )
      )
    );

    const cardsHtml = buildAdditionalClaimantCards(userCase, translations);
    rows.push(
      addSummaryHtmlRow(
        translations.groupClaimDetails.additionalClaimants,
        cardsHtml ?? translations.notProvided,
        createChangeAction(
          PageUrls.REVIEW_ADDITIONAL_CLAIMANTS + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.groupClaimDetails.groupRepresentative
        )
      )
    );

    rows.push(
      addSummaryRow(
        translations.groupClaimDetails.groupRepresentative,
        getTranslationsGroupRepresentative(userCase, translations),
        createChangeAction(
          PageUrls.GROUP_REPRESENTATIVE + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.groupClaimDetails.groupRepresentative
        )
      )
    );
  }

  return rows;
};
