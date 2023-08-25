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
  const contactTheTribunalSelectedUrl = PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(
    ':selectedOption',
    userCase.contactApplicationType
  );
  const downloadLink = createDownloadLink(selectedApplication.value.documentUpload);
  const typeOfApplication = translations[selectedApplication.value.type];

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
