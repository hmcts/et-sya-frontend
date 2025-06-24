import {
  CaseWithId,
  PayInterval,
  StillWorking,
  WeeksOrMonths,
  YesOrNo,
  YesOrNoOrNotSure,
} from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { TypesOfClaim } from '../../definitions/definition';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

const getTranslationsForStillWorkingEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  switch (userCase.isStillWorking) {
    case StillWorking.WORKING:
      return translations.employmentDetails.working;
    case StillWorking.NOTICE:
      return translations.employmentDetails.notice;
    case StillWorking.NO_LONGER_WORKING:
      return translations.employmentDetails.noLongerWorking;
    default:
      return translations.employmentDetails.notProvided;
  }
};

const getTranslationsForPayIntervalEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  switch (userCase.payInterval) {
    case PayInterval.ANNUAL:
      return translations.employmentDetails.annual;
    case PayInterval.MONTHLY:
      return translations.employmentDetails.monthly;
    case PayInterval.WEEKLY:
      return translations.employmentDetails.weekly;
    default:
      return translations.employmentDetails.notProvided;
  }
};

export const getEmploymentDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const employmentDetails = [];

  if (userCase.pastEmployer !== YesOrNo.YES) {
    employmentDetails.push(
      {
        key: {
          text: translations.employmentDetails.header,
          classes: 'govuk-summary-list__key govuk-heading-m',
        },
        value: {},
      },
      addSummaryRow(
        translations.employmentDetails.didYouWorkFor,
        userCase.pastEmployer
          ? translations.employmentDetails.didYouWorkForNo
          : translations.employmentDetails.notProvided,
        createChangeAction(
          PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.didYouWorkFor
        )
      )
    );
  } else {
    if (!userCase.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL)) {
      employmentDetails.push(
        {
          key: {
            text: translations.employmentDetails.header,
            classes: 'govuk-summary-list__key govuk-heading-m',
          },
          value: {},
        },
        addSummaryRow(
          translations.employmentDetails.didYouWorkFor,
          translations.employmentDetails.didYouWorkForYes,
          createChangeAction(
            PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.didYouWorkFor
          )
        )
      );
    }

    employmentDetails.push(
      addSummaryRow(
        translations.employmentDetails.isStillWorking,
        getTranslationsForStillWorkingEnum(userCase, translations),
        createChangeAction(
          PageUrls.STILL_WORKING + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.isStillWorking
        )
      ),
      addSummaryRow(
        translations.employmentDetails.jobTitle,
        userCase.jobTitle,
        createChangeAction(
          PageUrls.JOB_TITLE + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.jobTitle
        )
      ),
      addSummaryRow(
        translations.employmentDetails.startDate,
        userCase.startDate === undefined
          ? ''
          : userCase.startDate.day + '-' + userCase.startDate.month + '-' + userCase.startDate.year,
        createChangeAction(
          PageUrls.START_DATE + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.startDate
        )
      )
    );

    if (
      userCase.isStillWorking === StillWorking.WORKING ||
      userCase.isStillWorking === StillWorking.NO_LONGER_WORKING
    ) {
      if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
        employmentDetails.push(
          addSummaryRow(
            translations.employmentDetails.endDate,
            userCase.endDate === undefined
              ? ''
              : userCase.endDate.day + '-' + userCase.endDate.month + '-' + userCase.endDate.year,
            createChangeAction(
              PageUrls.END_DATE + InterceptPaths.ANSWERS_CHANGE,
              translations.change,
              translations.employmentDetails.endDate
            )
          )
        );
      }
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.noticePeriod,
          userCase.noticePeriod === YesOrNo.YES
            ? translations.employmentDetails.yes
            : translations.employmentDetails.no,
          createChangeAction(
            PageUrls.NOTICE_PERIOD + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.noticePeriod
          )
        )
      );
    } else {
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.noticeEnds,
          userCase.noticeEnds === undefined
            ? ''
            : userCase.noticeEnds.day + '-' + userCase.noticeEnds.month + '-' + userCase.noticeEnds.year,
          createChangeAction(
            PageUrls.NOTICE_END + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.noticeEnds
          )
        )
      );
    }
    if (userCase.noticePeriod === YesOrNo.YES || userCase.isStillWorking === StillWorking.NOTICE) {
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.noticePeriodWeeksOrMonths,
          userCase.noticePeriodUnit === WeeksOrMonths.MONTHS
            ? translations.employmentDetails.months
            : translations.employmentDetails.weeks,
          createChangeAction(
            PageUrls.NOTICE_TYPE + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.noticePeriodWeeksOrMonths
          )
        ),
        addSummaryRow(
          translations.employmentDetails.noticeLength,
          userCase.noticePeriodLength,
          createChangeAction(
            PageUrls.NOTICE_LENGTH + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.noticeLength
          )
        )
      );
    }
    employmentDetails.push(
      addSummaryRow(
        translations.employmentDetails.weeklyHours,
        userCase.avgWeeklyHrs,
        createChangeAction(
          PageUrls.AVERAGE_WEEKLY_HOURS + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.weeklyHours
        )
      ),
      addSummaryRow(
        translations.employmentDetails.payBeforeTax,
        userCase.payBeforeTax,
        createChangeAction(
          PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.payBeforeTax
        )
      ),
      addSummaryRow(
        translations.employmentDetails.payAfterTax,
        userCase.payAfterTax,
        createChangeAction(
          PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.payAfterTax
        )
      ),
      addSummaryRow(
        translations.employmentDetails.payPeriod,
        getTranslationsForPayIntervalEnum(userCase, translations),
        createChangeAction(
          PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.payPeriod
        )
      ),
      addSummaryRow(
        translations.employmentDetails.pensionScheme,
        userCase?.claimantPensionContribution === YesOrNoOrNotSure.YES
          ? translations.employmentDetails.yes + ': ' + userCase.claimantPensionWeeklyContribution
          : translations.employmentDetails.no,
        createChangeAction(
          PageUrls.PENSION + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.pensionScheme
        )
      ),
      addSummaryRow(
        translations.employmentDetails.benefits,
        userCase?.employeeBenefits === YesOrNo.YES
          ? translations.employmentDetails.yes + ': ' + userCase.benefitsCharCount
          : translations.employmentDetails.no,
        createChangeAction(
          PageUrls.BENEFITS + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.benefits
        )
      )
    );

    if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.newJob,
          userCase.newJob,
          createChangeAction(
            PageUrls.NEW_JOB + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.newJob
          )
        )
      );

      if (userCase.newJob === YesOrNo.YES) {
        employmentDetails.push(
          addSummaryRow(
            translations.employmentDetails.newStartDate,
            userCase.newJobStartDate === undefined
              ? ''
              : userCase.newJobStartDate.day +
                  '-' +
                  userCase.newJobStartDate.month +
                  '-' +
                  userCase.newJobStartDate.year,
            createChangeAction(
              PageUrls.NEW_JOB_START_DATE + InterceptPaths.ANSWERS_CHANGE,
              translations.change,
              translations.employmentDetails.newStartDate
            )
          ),
          addSummaryRow(
            translations.employmentDetails.newPayBeforeTax,
            userCase.newJobPay,
            createChangeAction(
              PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE,
              translations.change,
              translations.employmentDetails.newPayBeforeTax
            )
          ),
          addSummaryRow(
            translations.employmentDetails.payPeriod,
            userCase.newJobPayInterval,
            createChangeAction(
              PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE,
              translations.change,
              translations.employmentDetails.payPeriod
            )
          )
        );
      }
    }
  }
  return employmentDetails;
};
