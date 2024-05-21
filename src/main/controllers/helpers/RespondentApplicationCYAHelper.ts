import { CaseWithId, YesOrNo } from '../../definitions/case';
import { applicationTypes } from '../../definitions/contact-applications';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { copyToOtherPartyRedirectUrl } from './LinkHelpers';

export const getRespondentCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  supportingMaterialUrl: string,
  downloadLink: string,
  responseUrl: string
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const { legend, supportingMaterial, change, copyToOtherPartyYesOrNo } = translations;

  rows.push(
    addSummaryRow(
      legend,
      userCase.responseText,
      createChangeAction(responseUrl + languageParam, change, translations.legend)
    ),
    addSummaryHtmlRow(
      supportingMaterial,
      downloadLink,
      createChangeAction(supportingMaterialUrl + languageParam, change, translations.supportingMaterial)
    )
  );

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType) && userCase.copyToOtherPartyYesOrNo) {
    rows.push(
      addSummaryRow(
        copyToOtherPartyYesOrNo,
        translations[userCase.copyToOtherPartyYesOrNo],
        createChangeAction(
          copyToOtherPartyRedirectUrl(userCase) + languageParam,
          change,
          translations.copyToOtherPartyYesOrNo
        )
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRow(
          translations.copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          createChangeAction(
            copyToOtherPartyRedirectUrl(userCase) + languageParam,
            change,
            translations.copyToOtherPartyText
          )
        )
      );
    }
  }

  return rows;
};
