import { CaseWithId, Respondent, YesOrNo } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { answersAddressFormatter } from './PageContentHelpers';

export const getRespondentSection = (
  userCase: CaseWithId,
  respondent: Respondent,
  index: number,
  translations: AnyRecord
): unknown => {
  const respondentSections = [];
  respondentSections.push(
    {
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
    },
    {
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
            href: '/respondent/' + index + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.respondentDetails.respondentAddress,
          },
        ],
      },
    }
  );
  if (index === 1) {
    respondentSections.push({
      key: {
        text: translations.respondentDetails.workedAtRespondent,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase.claimantWorkAddressQuestion,
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
  const acasCertValue = respondent.acasCert === YesOrNo.YES ? respondent.acasCertNum : respondent.acasCert;
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
  if (acasCertValue === YesOrNo.NO) {
    respondentSections.push({
      key: {
        text: translations.respondentDetails.noAcasReason,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: respondent.noAcasReason,
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

export const getRespondentDetailsSection = (
  respondent: Respondent,
  index: string,
  translations: AnyRecord
): unknown => {
  const respondentSections = [];
  respondentSections.push(
    {
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
    },
    {
      key: {
        text: translations.address,
      },
      value: {
        text: answersAddressFormatter(respondent.respondentAddress1, respondent.respondentAddressPostcode),
      },
      actions: {
        items: [
          {
            href: '/respondent/' + index + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.RESPONDENT_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.address,
          },
        ],
      },
    },
    {
      key: {
        text: translations.acasNum,
      },
      value: {
        html: respondent.acasCertNum === undefined ? translations.unProvided : respondent.acasCertNum,
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
    }
  );
  return respondentSections;
};
