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

export interface GroupClaimDetails {
  metaRows: SummaryListRow[];
  cardsHtml: string;
  postRows: SummaryListRow[];
}

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
      const removeUrl = `${PageUrls.REMOVE_ADDITIONAL_CLAIMANT}${InterceptPaths.ANSWERS_CHANGE}&additionalClaimant=${index}`;
      const changePersonalUrl = `${PageUrls.ADDITIONAL_CLAIMANT_PERSONAL_DETAILS}${InterceptPaths.ANSWERS_CHANGE}&additionalClaimant=${index}`;
      const changeAddressUrl = `${PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_ENTER}${InterceptPaths.ANSWERS_CHANGE}&additionalClaimant=${index}`;

      return `
    <div class="govuk-summary-card govuk-!-margin-bottom-4">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">
          ${translations.groupClaimDetails.additionalClaimant} ${index + 1}
        </h2>
        <ul class="govuk-summary-card__actions">
          <li class="govuk-summary-card__action">
            <a class="govuk-link" href="${removeUrl}">${translations.groupClaimDetails.removeClaimant}</a>
          </li>
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.nameLabel}</dt>
            <dd class="govuk-summary-list__value">${formatName(claimant) || translations.notProvided}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="${changePersonalUrl}">${
        translations.change
      }<span class="govuk-visually-hidden"> ${translations.groupClaimDetails.nameLabel}</span></a></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.emailLabel}</dt>
            <dd class="govuk-summary-list__value">${claimant.email || translations.notProvided}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="${changePersonalUrl}">${
        translations.change
      }<span class="govuk-visually-hidden"> ${translations.groupClaimDetails.emailLabel}</span></a></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.dobLabel}</dt>
            <dd class="govuk-summary-list__value">${formatDob(claimant.dob) || translations.notProvided}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="${changePersonalUrl}">${
        translations.change
      }<span class="govuk-visually-hidden"> ${translations.groupClaimDetails.dobLabel}</span></a></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">${translations.groupClaimDetails.addressLabel}</dt>
            <dd class="govuk-summary-list__value">${formatAddress(claimant) || translations.notProvided}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="${changeAddressUrl}">${
        translations.change
      }<span class="govuk-visually-hidden"> ${translations.groupClaimDetails.addressLabel}</span></a></dd>
          </div>
        </dl>
      </div>
    </div>
  `;
    })
    .join('');
}

export const getGroupClaimDetails = (userCase: CaseWithId, translations: AnyRecord): GroupClaimDetails => {
  const metaRows: SummaryListRow[] = [];

  metaRows.push(
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

  if (userCase?.caseType === CaseType.MULTIPLE) {
    metaRows.push(
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
  }

  if (userCase?.caseType === CaseType.MULTIPLE && userCase.addClaimantMethod === AddAdditionalClaimant.SPREADSHEET) {
    metaRows.push(
      addSummaryHtmlRow(
        translations.groupClaimDetails.additionalClaimantDocument,
        '<a class="govuk-link" href="' +
          userCase.additionalClaimantSpreadsheet.document_binary_url +
          '">' +
          userCase.additionalClaimantSpreadsheet.document_filename +
          '</a>',
        createChangeAction(
          PageUrls.ADDITIONAL_CLAIMANT_FILE_UPLOAD + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.groupClaimDetails.groupRepresentative
        )
      ),
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

  if (userCase?.caseType !== CaseType.MULTIPLE || userCase?.addClaimantMethod === AddAdditionalClaimant.SPREADSHEET) {
    return { metaRows, cardsHtml: '', postRows: [] };
  }

  const cardsHtml = buildAdditionalClaimantCards(userCase, translations);

  const postRows: SummaryListRow[] = [
    addSummaryRow(
      translations.groupClaimDetails.groupRepresentative,
      getTranslationsGroupRepresentative(userCase, translations),
      createChangeAction(
        PageUrls.GROUP_REPRESENTATIVE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.groupClaimDetails.groupRepresentative
      )
    ),
  ];

  return { metaRows, cardsHtml, postRows };
};
