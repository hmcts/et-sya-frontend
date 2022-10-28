import {CaseWithId, PayInterval, StillWorking, WeeksOrMonths, YesOrNo, YesOrNoOrNotSure} from '../../definitions/case';
import {InterceptPaths, PageUrls} from '../../definitions/constants';
import {TypesOfClaim} from '../../definitions/definition';
import {AnyRecord} from '../../definitions/util-types';

let getTranslationsForStillWorkingEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  let translation = translations.employmentDetails.working;
  if (userCase.isStillWorking === StillWorking.NOTICE) {
    translation = translations.employmentDetails.notice;
  } else if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
    translation = translations.employmentDetails.noLongerWorking;
  }
  return translation;
};

let getTranslationsForPayIntervalEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  let translation = translations.employmentDetails.annual;
  if (userCase.payInterval === PayInterval.MONTHLY) {
    translation = translations.employmentDetails.monthly;
  } else if (userCase.payInterval === PayInterval.WEEKLY) {
    translation = translations.employmentDetails.weekly;
  }
  return translation;
};


export const getEmploymentDetails = (
  userCase: CaseWithId,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const employmentDetails = [];
  employmentDetails.push({
    key: {
      text: translations.employmentDetails.header,
      classes: 'govuk-heading-m',
    },
  });

  if (userCase.pastEmployer === YesOrNo.NO) {
    employmentDetails.push({
      key: {
        text: translations.employmentDetails.didYouWorkFor,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: translations.employmentDetails.no,
      },
      actions: {
        items: [
          {
            href: PageUrls.PAST_EMPLOYER,
            text: translations.change,
            visuallyHiddenText: translations.employmentDetails.didYouWorkFor,
          },
        ],
      },
    });
  } else {
    if (!userCase.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL)) {
      employmentDetails.push({
        key: {
          text: translations.employmentDetails.didYouWorkFor,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: translations.employmentDetails.yes,
        },
        actions: {
          items: [
            {
              href: PageUrls.PAST_EMPLOYER,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.didYouWorkFor,
            },
          ],
        },
      });
    }
    employmentDetails.push(
      {
        key: {
          text: translations.employmentDetails.isStillWorking,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: getTranslationsForStillWorkingEnum(userCase,translations),
        },
        actions: {
          items: [
            {
              href: PageUrls.STILL_WORKING,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.isStillWorking,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.jobTitle,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: userCase.jobTitle,
        },
        actions: {
          items: [
            {
              href: PageUrls.JOB_TITLE + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.jobTitle,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.startDate,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text:
            userCase.startDate === undefined
              ? ''
              : userCase.startDate.day + '-' + userCase.startDate.month + '-' + userCase.startDate.year,
        },
        actions: {
          items: [
            {
              href: PageUrls.START_DATE + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.startDate,
            },
          ],
        },
      }
    );
    if (
      userCase.isStillWorking === StillWorking.WORKING ||
      userCase.isStillWorking === StillWorking.NO_LONGER_WORKING
    ) {
      employmentDetails.push({
        key: {
          text: translations.employmentDetails.noticePeriod,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: userCase.noticePeriod,
        },
        actions: {
          items: [
            {
              href: PageUrls.NOTICE_PERIOD + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.noticePeriod,
            },
          ],
        },
      });
    } else {
      employmentDetails.push({
        key: {
          text: translations.employmentDetails.noticeEnds,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text:
            userCase.noticeEnds === undefined
              ? ''
              : userCase.noticeEnds.day + '-' + userCase.noticeEnds.month + '-' + userCase.noticeEnds.year,
        },
        actions: {
          items: [
            {
              href: PageUrls.NOTICE_END + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.noticeEnds,
            },
          ],
        },
      });
    }
    if (userCase.noticePeriod === YesOrNo.YES || userCase.isStillWorking === StillWorking.NOTICE) {
      employmentDetails.push(
        {
          key: {
            text: translations.employmentDetails.noticePeriodWeeksOrMonths,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            text: userCase.noticePeriodUnit === WeeksOrMonths.MONTHS ?
              translations.employmentDetails.months : translations.employmentDetails.weeks
          },
          actions: {
            items: [
              {
                href: PageUrls.NOTICE_TYPE + InterceptPaths.ANSWERS_CHANGE,
                text: translations.change,
                visuallyHiddenText: translations.employmentDetails.noticePeriodWeeksOrMonths,
              },
            ],
          },
        },
        {
          key: {
            text: translations.employmentDetails.noticeLength,
            classes: 'govuk-!-font-weight-regular-m',
          },
          value: {
            text: userCase.noticePeriodLength,
          },
          actions: {
            items: [
              {
                href: PageUrls.NOTICE_LENGTH + InterceptPaths.ANSWERS_CHANGE,
                text: translations.change,
                visuallyHiddenText: translations.employmentDetails.noticeLength,
              },
            ],
          },
        }
      );
    }
    employmentDetails.push(
      {
        key: {
          text: translations.employmentDetails.weeklyHours,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: userCase.avgWeeklyHrs,
        },
        actions: {
          items: [
            {
              href: PageUrls.AVERAGE_WEEKLY_HOURS + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.weeklyHours,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.payBeforeTax,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: userCase.payBeforeTax,
        },
        actions: {
          items: [
            {
              href: PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.payBeforeTax,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.payAfterTax,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: userCase.payAfterTax,
        },
        actions: {
          items: [
            {
              href: PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.payAfterTax,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.payPeriod,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: getTranslationsForPayIntervalEnum(userCase, translations),
        },
        actions: {
          items: [
            {
              href: PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.payPeriod,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.pensionScheme,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text:
            userCase?.claimantPensionContribution === YesOrNoOrNotSure.YES
              ? translations.employmentDetails.yes + ': ' + userCase.claimantPensionWeeklyContribution
              : translations.employmentDetails.no,
        },
        actions: {
          items: [
            {
              href: PageUrls.PENSION + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.pensionScheme,
            },
          ],
        },
      },
      {
        key: {
          text: translations.employmentDetails.benefits,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text:
            userCase?.employeeBenefits === YesOrNo.YES
              ? translations.employmentDetails.yes + ': ' + userCase.benefitsCharCount
              : translations.employmentDetails.no,
        },
        actions: {
          items: [
            {
              href: PageUrls.BENEFITS + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.benefits,
            },
          ],
        },
      }
    );
    if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      employmentDetails.push({
        key: {
          text: translations.employmentDetails.newJob,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: userCase.newJob,
        },
        actions: {
          items: [
            {
              href: PageUrls.NEW_JOB + InterceptPaths.ANSWERS_CHANGE,
              text: translations.change,
              visuallyHiddenText: translations.employmentDetails.newJob,
            },
          ],
        },
      });
      if (userCase.newJob === YesOrNo.YES) {
        employmentDetails.push(
          {
            key: {
              text: translations.employmentDetails.newStartDate,
              classes: 'govuk-!-font-weight-regular-m',
            },
            value: {
              text:
                userCase.newJobStartDate.day === undefined
                  ? ''
                  : userCase.newJobStartDate.day +
                  '-' +
                  userCase.newJobStartDate.month +
                  '-' +
                  userCase.newJobStartDate.year,
            },
            actions: {
              items: [
                {
                  href: PageUrls.NEW_JOB_START_DATE + InterceptPaths.ANSWERS_CHANGE,
                  text: translations.change,
                  visuallyHiddenText: translations.employmentDetails.newStartDate,
                },
              ],
            },
          },
          {
            key: {
              text: translations.employmentDetails.newPayBeforeTax,
              classes: 'govuk-!-font-weight-regular-m',
            },
            value: {
              text: userCase.newJobPay,
            },
            actions: {
              items: [
                {
                  href: PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE,
                  text: translations.change,
                  visuallyHiddenText: translations.employmentDetails.newPayBeforeTax,
                },
              ],
            },
          },
          {
            key: {
              text: translations.employmentDetails.payPeriod,
              classes: 'govuk-!-font-weight-regular-m',
            },
            value: {
              text: userCase.newJobPayInterval,
            },
            actions: {
              items: [
                {
                  href: PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE,
                  text: translations.change,
                  visuallyHiddenText: translations.employmentDetails.payPeriod,
                },
              ],
            },
          }
        );
      }
    }
  }
  return employmentDetails;
};
