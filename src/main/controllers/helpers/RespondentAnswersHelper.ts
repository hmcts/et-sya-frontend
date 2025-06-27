import { CaseWithId, NoAcasNumberReason, Respondent, YesOrNo } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { SummaryListRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

export const getAcasReason = (noAcasReason: NoAcasNumberReason, translations: AnyRecord): string => {
  switch (noAcasReason) {
    case NoAcasNumberReason.ANOTHER:
      return translations.acasReason.another;
    case NoAcasNumberReason.EMPLOYER:
      return translations.acasReason.employer;
    case NoAcasNumberReason.NO_POWER:
      return translations.acasReason.no_power;
    case NoAcasNumberReason.UNFAIR_DISMISSAL:
      return translations.acasReason.unfair_dismissal;
    default:
      return undefined;
  }
};

const respondentTitle = (index: number, translations: AnyRecord, languageParam: string): string => {
  if (languageParam === '?lng=cy') {
    return (
      translations.respondentDetails.details[0].toUpperCase() +
      translations.respondentDetails.details.slice(1) +
      ' ' +
      translations.respondentDetails.header +
      index
    );
  } else {
    return translations.respondentDetails.header + index + translations.respondentDetails.details;
  }
};

export const getRespondentSection = (
  userCase: CaseWithId,
  respondent: Respondent,
  index: number,
  translations: AnyRecord,
  languageParam: string,
  addRemoveButton: boolean
): SummaryListRow[] => {
  const respondentSections: SummaryListRow[] = [];
  if (index === 1 || !addRemoveButton) {
    respondentSections.push({
      key: {
        text: respondentTitle(index, translations, languageParam),
        classes: 'govuk-heading-m',
      },
      value: {
        text: '',
      },
    });
  } else {
    respondentSections.push({
      key: {
        text: respondentTitle(index, translations, languageParam),
        classes: 'govuk-heading-m',
      },
      value: {
        text: '',
      },
      actions: {
        items: [
          {
            href: '/respondent/' + index + PageUrls.RESPONDENT_REMOVE + languageParam + '&redirect=answers',
            text: translations.removeRespondent,
            visuallyHiddenText: translations.removeRespondent,
          },
        ],
      },
    });
  }

  respondentSections.push({
    key: {
      text: translations.respondentDetails.respondentName,
      classes: 'govuk-!-font-weight-regular-m',
    },
    value: {
      text: respondent.respondentName,
    },
    actions: {
      items: [
        {
          href: '/respondent/' + index + PageUrls.RESPONDENT_NAME + InterceptPaths.ANSWERS_CHANGE,
          text: translations.change,
          visuallyHiddenText: translations.respondentDetails.respondentName,
        },
      ],
    },
  });

  respondentSections.push({
    key: {
      text: translations.respondentDetails.respondentAddress,
      classes: 'govuk-!-font-weight-regular-m',
    },
    value: {
      text: answersAddressFormatter(
        respondent.respondentAddress1,
        respondent.respondentAddress2,
        respondent.respondentAddressTown,
        respondent.respondentAddressCountry,
        respondent.respondentAddressPostcode
      ),
    },
    actions: {
      items: [
        {
          href: '/respondent/' + index + PageUrls.RESPONDENT_POSTCODE_ENTER + InterceptPaths.ANSWERS_CHANGE,
          text: translations.change,
          visuallyHiddenText: translations.respondentDetails.respondentAddress,
        },
      ],
    },
  });

  if (index === 1 && userCase.pastEmployer === YesOrNo.YES) {
    respondentSections.push({
      key: {
        text: translations.respondentDetails.workedAtRespondent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text:
          userCase.claimantWorkAddressQuestion === YesOrNo.YES ? translations.doYesOrNo.yes : translations.doYesOrNo.no,
      },
      actions: {
        items: [
          {
            href: '/respondent/' + index + PageUrls.WORK_ADDRESS + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.respondentDetails.workedAtRespondent,
          },
        ],
      },
    });
  }

  if (index === 1 && userCase.claimantWorkAddressQuestion === YesOrNo.NO) {
    respondentSections.push({
      key: {
        text: translations.respondentDetails.addressWorkedAt,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: answersAddressFormatter(
          userCase.workAddress1,
          userCase.workAddress2,
          userCase.workAddressTown,
          userCase.workAddressCountry,
          userCase.workAddressPostcode
        ),
      },
      actions: {
        items: [
          {
            href: '/respondent/' + index + PageUrls.PLACE_OF_WORK + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.respondentDetails.addressWorkedAt,
          },
        ],
      },
    });
  }

  const acasCertValue = respondent.acasCert === YesOrNo.YES ? respondent.acasCertNum : translations.doYesOrNo.no;
  respondentSections.push({
    key: {
      text: translations.respondentDetails.acasNumber,
      classes: 'govuk-!-font-weight-regular-m',
    },
    value: {
      text: acasCertValue,
    },
    actions: {
      items: [
        {
          href: '/respondent/' + index + PageUrls.ACAS_CERT_NUM + InterceptPaths.ANSWERS_CHANGE,
          text: translations.change,
          visuallyHiddenText: translations.respondentDetails.acasNumber,
        },
      ],
    },
  });
  if (respondent.acasCert === YesOrNo.NO) {
    const reasonText = getAcasReason(respondent.noAcasReason, translations);
    respondentSections.push({
      key: {
        text: translations.respondentDetails.noAcasReason,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: reasonText,
      },
      actions: {
        items: [
          {
            href: '/respondent/' + index + PageUrls.NO_ACAS_NUMBER + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.respondentDetails.noAcasReason,
          },
        ],
      },
    });
  }

  return respondentSections;
};

export const getRespondentDetailsCardActionItem = (
  index: string,
  translations: AnyRecord,
  languageParam: string
): unknown => {
  if (Number(index) === 1) {
    return '';
  }
  const respondentCardActionItem = [];
  respondentCardActionItem.push({
    href: '/respondent/' + index + PageUrls.RESPONDENT_REMOVE + languageParam,
    text: translations.removeRespondent,
    visuallyHiddenText: translations.removeRespondent,
  });
  return respondentCardActionItem;
};

export const getRespondentDetailsSection = (
  respondent: Respondent,
  index: string,
  translations: AnyRecord
): SummaryListRow[] => {
  const respondentSections: SummaryListRow[] = [];

  respondentSections.push({
    key: {
      text: translations.name,
    },
    value: {
      text: respondent.respondentName,
    },
    actions: {
      items: [
        {
          href: '/respondent/' + index + PageUrls.RESPONDENT_NAME + InterceptPaths.RESPONDENT_CHANGE,
          text: translations.change,
          visuallyHiddenText: translations.name,
        },
      ],
    },
  });

  respondentSections.push({
    key: {
      text: translations.address,
    },
    value: {
      text: answersAddressFormatter(
        respondent.respondentAddress1,
        respondent.respondentAddress2,
        respondent.respondentAddressTown,
        respondent.respondentAddressCountry,
        respondent.respondentAddressPostcode
      ),
    },
    actions: {
      items: [
        {
          href: '/respondent/' + index + PageUrls.RESPONDENT_POSTCODE_ENTER + InterceptPaths.RESPONDENT_CHANGE,
          text: translations.change,
          visuallyHiddenText: translations.address,
        },
      ],
    },
  });

  respondentSections.push({
    key: {
      text: translations.acasNum,
    },
    value: {
      html: respondent.acasCertNum ?? translations.unProvided,
    },
    actions: {
      items: [
        {
          href: '/respondent/' + index + PageUrls.ACAS_CERT_NUM + InterceptPaths.RESPONDENT_CHANGE,
          text: translations.change,
          visuallyHiddenText: translations.acasNum,
        },
      ],
    },
  });

  if (respondent.acasCert === YesOrNo.NO) {
    respondentSections.push({
      key: {
        text: translations.noAcasReason,
      },
      value: {
        html: getAcasReason(respondent.noAcasReason, translations),
      },
      actions: {
        items: [
          {
            href: '/respondent/' + index + PageUrls.ACAS_CERT_NUM + InterceptPaths.RESPONDENT_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.acasNum,
          },
        ],
      },
    });
  }

  return respondentSections;
};
