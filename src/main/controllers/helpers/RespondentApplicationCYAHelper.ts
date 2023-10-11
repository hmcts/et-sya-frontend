import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getRespondentCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  supportingMaterialUrl: string,
  downloadLink: string,
  responseUrl: string
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const { legend, supportingMaterial, change } = translations;

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
        translations.copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, change, translations.copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRow(
          translations.copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, change, translations.copyToOtherPartyText)
        )
      );
    }
  }

  return rows;
};
