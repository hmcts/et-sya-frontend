import { CaseWithId, YesOrNo } from '../../definitions/case';
import { CHANGE, PageUrls, WELSH_CHANGE, languages } from '../../definitions/constants';
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
  downloadLink: string
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const changeLinkLanguage = languageParam === languages.WELSH_URL_PARAMETER ? WELSH_CHANGE : CHANGE;

  rows.push(
    addSummaryRow(
      translations.legend,
      userCase.responseText,
      createChangeAction(supportingMaterialUrl + languageParam, changeLinkLanguage, translations.legend)
    ),
    addSummaryHtmlRow(
      translations.supportingMaterial,
      downloadLink,
      createChangeAction(supportingMaterialUrl + languageParam, changeLinkLanguage, translations.supportingMaterial)
    )
  );

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType) && userCase.copyToOtherPartyYesOrNo) {
    rows.push(
      addSummaryRow(
        translations.copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(
          PageUrls.COPY_TO_OTHER_PARTY + languageParam,
          changeLinkLanguage,
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
            PageUrls.COPY_TO_OTHER_PARTY + languageParam,
            changeLinkLanguage,
            translations.copyToOtherPartyText
          )
        )
      );
    }
  }

  return rows;
};
