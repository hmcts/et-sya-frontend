import { CaseWithId, YesOrNo } from '../../definitions/case';
import { CHANGE } from '../../definitions/constants';
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
  downloadLink: string
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.legend,
      userCase.responseText,
      createChangeAction(supportingMaterialUrl + languageParam, CHANGE, translations.legend)
    ),
    addSummaryHtmlRow(
      translations.supportingMaterial,
      downloadLink,
      createChangeAction(supportingMaterialUrl + languageParam, CHANGE, translations.supportingMaterial)
    )
  );

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType) && userCase.copyToOtherPartyYesOrNo) {
    rows.push(
      addSummaryRow(
        translations.copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(
          copyToOtherPartyRedirectUrl(userCase) + languageParam,
          CHANGE,
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
            CHANGE,
            translations.copyToOtherPartyText
          )
        )
      );
    }
  }

  return rows;
};
