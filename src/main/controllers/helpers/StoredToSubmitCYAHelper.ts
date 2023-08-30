import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { CHANGE, PageUrls, TranslationKeys } from '../../definitions/constants';
import { applicationTypes } from '../../definitions/contact-applications';
import {
  SummaryListRow,
  addSummaryHtmlRow,
  addSummaryRow,
  createChangeAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { createDownloadLink } from './DocumentHelpers';

export const getContactTribunalCyaContent = (req: AppRequest, languageParam: string): SummaryListRow[] => {
  const userCase = req.session.userCase;
  const selectedApplication = userCase.selectedGenericTseApplication;

  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
    ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
    ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
  };

  const {
    applicationType,
    legend,
    supportingMaterial,
    copyToOtherPartyYesOrNo,
    copyToOtherPartyText,
    haveYouSentCopyQuestion,
    haveYouSentCopyAnswer,
  } = translations;

  const cyaContent: SummaryListRow[] = [
    addSummaryRow(applicationType, translations[selectedApplication.value.type]),
    addSummaryRow(legend, selectedApplication.value.details),
  ];

  if (selectedApplication.value.documentUpload !== undefined) {
    cyaContent.push(
      addSummaryHtmlRow(supportingMaterial, createDownloadLink(selectedApplication.value.documentUpload))
    );
  } else {
    cyaContent.push(addSummaryRow(supportingMaterial, ''));
  }

  if (!applicationTypes.claimant.c.includes(selectedApplication.value.type)) {
    cyaContent.push(addSummaryRow(copyToOtherPartyYesOrNo, selectedApplication.value.copyToOtherPartyYesOrNo));

    if (selectedApplication.value.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      cyaContent.push(addSummaryRow(copyToOtherPartyText, selectedApplication.value.copyToOtherPartyText));
    }
  }

  cyaContent.push(
    addSummaryRow(
      haveYouSentCopyQuestion,
      haveYouSentCopyAnswer,
      createChangeAction(
        PageUrls.STORED_TO_SUBMIT.replace(':appId', selectedApplication.id) + languageParam,
        CHANGE,
        haveYouSentCopyQuestion
      )
    )
  );

  return cyaContent;
};
