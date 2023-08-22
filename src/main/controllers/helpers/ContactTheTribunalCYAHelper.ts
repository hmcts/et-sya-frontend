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
  const { applicationType, legend, supportingMaterial, copyToOtherPartyYesOrNo, copyToOtherPartyText } = translations;
  const cyaContent: SummaryListRow[] = [
    addSummaryRow(
      applicationType,
      typeOfApplication,
      createChangeAction(PageUrls.CONTACT_THE_TRIBUNAL + languageParam, CHANGE, applicationType)
    ),
    addSummaryRow(
      legend,
      userCase.contactApplicationText,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, CHANGE, legend)
    ),
    addSummaryHtmlRow(
      supportingMaterial,
      downloadLink,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, CHANGE, supportingMaterial)
    ),
  ];

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType)) {
    cyaContent.push(
      addSummaryRow(
        copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, CHANGE, copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      cyaContent.push(
        addSummaryRow(
          copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, CHANGE, copyToOtherPartyText)
        )
      );
    }
  }

  return cyaContent;
};
