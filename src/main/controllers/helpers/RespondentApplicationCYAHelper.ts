import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { CHANGE, PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { AnyRecord } from '../../definitions/util-types';

export const getRespondentCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  supportingMaterialUrl: string,
  downloadLink: string
): SummaryListRow[] => {
  const result = [
    addSummaryRow(translations.legend, userCase.responseText, undefined,
      createChangeAction(supportingMaterialUrl + languageParam, CHANGE, translations.legend)
    ),
    addSummaryRow(translations.supportingMaterial, undefined, downloadLink,
      createChangeAction(supportingMaterialUrl + languageParam, CHANGE, translations.supportingMaterial)
    ),
  ];

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType) && userCase.copyToOtherPartyYesOrNo) {
    result.push(
      addSummaryRow(translations.copyToOtherPartyYesOrNo, userCase.copyToOtherPartyYesOrNo, undefined,
        createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, CHANGE, translations.copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.YES) {
      result.push(
        addSummaryRow(translations.copyToOtherPartyText, userCase.copyToOtherPartyText, undefined,
          createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, CHANGE, translations.copyToOtherPartyText)
        )
      );
    }
  }

  return result;
};
