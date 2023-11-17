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

import { copyToOtherPartyRedirectUrl } from './LinkHelpers';

export const getCyaContent = (
  userCase: CaseWithId,
  translations: AnyRecord,
  languageParam: string,
  contactTheTribunalSelectedUrl: string,
  downloadLink: string,
  typeOfApplication: string
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const {
    applicationType,
    legend,
    supportingMaterial,
    copyToOtherPartyYesOrNo,
    copyToOtherPartyText,
    change,
    yes,
    no,
  } = translations;

  rows.push(
    addSummaryRow(
      applicationType,
      typeOfApplication,
      createChangeAction(PageUrls.CONTACT_THE_TRIBUNAL + languageParam, change, applicationType)
    ),
    addSummaryRow(
      legend,
      userCase.contactApplicationText,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, change, legend)
    ),
    addSummaryHtmlRow(
      supportingMaterial,
      downloadLink,
      createChangeAction(contactTheTribunalSelectedUrl + languageParam, change, supportingMaterial)
    )
  );

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType)) {
    rows.push(
      addSummaryRow(
        copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(copyToOtherPartyRedirectUrl(userCase) + languageParam, CHANGE, copyToOtherPartyYesOrNo)
//        userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? yes : no,
//        createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, change, copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRow(
          copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          createChangeAction(copyToOtherPartyRedirectUrl(userCase) + languageParam, CHANGE, copyToOtherPartyText)
//          createChangeAction(PageUrls.COPY_TO_OTHER_PARTY + languageParam, change, copyToOtherPartyText)
        )
      );
    }
  }

  return rows;
};
