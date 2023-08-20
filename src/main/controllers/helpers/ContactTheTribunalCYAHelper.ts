import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  contactTheTribunalSelectedUrl: string,
  downloadLink: string,
  typeOfApplication: string
): SummaryListRow[] => {
  const { applicationType, legend, supportingMaterial, change, copyToOtherPartyYesOrNo, copyToOtherPartyText } =
    translations;
  const cyaContent: SummaryListRow[] = [
    addSummaryRow(
      applicationType,
      typeOfApplication,
      undefined,
      createChangeAction(PageUrls.CONTACT_THE_TRIBUNAL + languageParam, change, applicationType)
    ),
    addSummaryRow(
      legend,
      userCase.contactApplicationText,
      undefined,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, change, legend)
    ),
    addSummaryRow(
      supportingMaterial,
      undefined,
      downloadLink,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, change, supportingMaterial)
    ),
  ];

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType)) {
    cyaContent.push(
      addSummaryRow(
        copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        undefined,
        createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, change, copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      cyaContent.push(
        addSummaryRow(
          copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          undefined,
          createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, change, copyToOtherPartyText)
        )
      );
    }
  }

  return cyaContent;
};
