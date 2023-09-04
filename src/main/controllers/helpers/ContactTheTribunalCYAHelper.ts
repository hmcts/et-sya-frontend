import { CaseWithId, YesOrNo } from '../../definitions/case';
import { CHANGE, PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  contactTheTribunalSelectedUrl: string,
  downloadLink: string,
  typeOfApplication: string
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const { applicationType, legend, supportingMaterial, copyToOtherPartyYesOrNo, copyToOtherPartyText } = translations;

  rows.push(
    addSummaryRow(
      applicationType,
      typeOfApplication,
      createChangeAction(PageUrls.CONTACT_THE_TRIBUNAL + languageParam, CHANGE, applicationType)
    )
  );

  rows.push(
    addSummaryRow(
      legend,
      userCase.contactApplicationText,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, CHANGE, legend)
    )
  );

  rows.push(
    addSummaryHtmlRow(
      supportingMaterial,
      downloadLink,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, CHANGE, supportingMaterial)
    )
  );

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType)) {
    rows.push(
      addSummaryRow(
        copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, CHANGE, copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRow(
          copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, CHANGE, copyToOtherPartyText)
        )
      );
    }
  }

  return rows;
};
