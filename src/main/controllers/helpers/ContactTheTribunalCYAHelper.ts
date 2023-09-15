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

import { copyToOtherPartyRedirectUrl } from './Rule92NotSystemUserHelper';

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
    )
  );

  if (!applicationTypes.claimant.c.includes(userCase.contactApplicationType)) {
    rows.push(
      addSummaryRow(
        copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo,
        createChangeAction(copyToOtherPartyRedirectUrl(userCase) + languageParam, CHANGE, copyToOtherPartyYesOrNo)
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRow(
          copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          createChangeAction(copyToOtherPartyRedirectUrl(userCase) + languageParam, CHANGE, copyToOtherPartyText)
        )
      );
    }
  }

  return rows;
};
