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

import { formatCaseDateDDMMYYYY } from './PageContentHelpers';

const getTranslationsForStillWorkingEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  let translation = translations.employmentDetails.working;
  if (userCase.isStillWorking === StillWorking.NOTICE) {
    translation = translations.employmentDetails.notice;
  } else if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
    translation = translations.employmentDetails.noLongerWorking;
  }
  return translation;
};

const getTranslationsForPayIntervalEnum = function (userCase: CaseWithId, translations: AnyRecord) {
  let translation = translations.employmentDetails.annual;
  if (userCase.payInterval === PayInterval.MONTHLY) {
    translation = translations.employmentDetails.monthly;
  } else if (userCase.payInterval === PayInterval.WEEKLY) {
    translation = translations.employmentDetails.weekly;
  }
  return translation;
};

export const getEmploymentDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const { change, employmentDetails } = translations;
  const { benefits, didYouWorkFor, endDate, header, isStillWorking, jobTitle, months, newJob } = employmentDetails;
  const { newPayBeforeTax, newStartDate, no, noticeEnds, noticeLength, noticePeriod } = employmentDetails;
  const { noticePeriodWeeksOrMonths, payAfterTax, payBeforeTax, payPeriod, pensionScheme } = employmentDetails;
  const { startDate, weeks, weeklyHours, yes } = employmentDetails;

  const rows: SummaryListRow[] = [{ key: { text: header, classes: 'govuk-summary-list__key govuk-heading-m' } }];

  if (userCase.pastEmployer === YesOrNo.NO) {
    rows.push(
      addSummaryRow(
        didYouWorkFor,
        no,
        createChangeAction(PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE, change, didYouWorkFor)
      )
    );

    return rows;
  }

  if (!userCase.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL)) {
    rows.push(
      addSummaryRow(
        didYouWorkFor,
        yes,
        createChangeAction(PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE, change, didYouWorkFor)
      )
    );
  }

  rows.push(
    addSummaryRow(
      isStillWorking,
      getTranslationsForStillWorkingEnum(userCase, translations),
      createChangeAction(PageUrls.STILL_WORKING + InterceptPaths.ANSWERS_CHANGE, change, isStillWorking)
    ),
    addSummaryRow(
      jobTitle,
      userCase.jobTitle,
      createChangeAction(PageUrls.JOB_TITLE + InterceptPaths.ANSWERS_CHANGE, change, jobTitle)
    ),
    addSummaryRow(
      startDate,
      formatCaseDateDDMMYYYY(userCase.startDate) ?? '',
      createChangeAction(PageUrls.START_DATE + InterceptPaths.ANSWERS_CHANGE, change, startDate)
    )
  );

  if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
    rows.push(
      addSummaryRow(
        endDate,
        formatCaseDateDDMMYYYY(userCase.endDate) ?? '',
        createChangeAction(PageUrls.END_DATE + InterceptPaths.ANSWERS_CHANGE, change, endDate)
      )
    );
  }

  if (userCase.isStillWorking === StillWorking.NOTICE) {
    rows.push(
      addSummaryRow(
        noticeEnds,
        formatCaseDateDDMMYYYY(userCase.noticeEnds) ?? '',
        createChangeAction(PageUrls.NOTICE_END + InterceptPaths.ANSWERS_CHANGE, change, noticeEnds)
      )
    );
  } else {
    rows.push(
      addSummaryRow(
        noticePeriod,
        userCase.noticePeriod === YesOrNo.YES ? yes : no,
        createChangeAction(PageUrls.NOTICE_PERIOD + InterceptPaths.ANSWERS_CHANGE, change, noticePeriod)
      )
    );
  }

  if (userCase.noticePeriod === YesOrNo.YES || userCase.isStillWorking === StillWorking.NOTICE) {
    rows.push(
      addSummaryRow(
        noticePeriodWeeksOrMonths,
        userCase.noticePeriodUnit === WeeksOrMonths.MONTHS ? months : weeks,
        createChangeAction(PageUrls.NOTICE_TYPE + InterceptPaths.ANSWERS_CHANGE, change, noticePeriodWeeksOrMonths)
      ),
      addSummaryRow(
        noticeLength,
        userCase.noticePeriodLength,
        createChangeAction(PageUrls.NOTICE_LENGTH + InterceptPaths.ANSWERS_CHANGE, change, noticeLength)
      )
    );
  }
  rows.push(
    addSummaryRow(
      weeklyHours,
      userCase.avgWeeklyHrs,
      createChangeAction(PageUrls.AVERAGE_WEEKLY_HOURS + InterceptPaths.ANSWERS_CHANGE, change, weeklyHours)
    ),
    addSummaryRow(
      payBeforeTax,
      userCase.payBeforeTax,
      createChangeAction(PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE, change, payBeforeTax)
    ),
    addSummaryRow(
      payAfterTax,
      userCase.payAfterTax,
      createChangeAction(PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE, change, payAfterTax)
    ),
    addSummaryRow(
      payPeriod,
      getTranslationsForPayIntervalEnum(userCase, translations),
      createChangeAction(PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE, change, payPeriod)
    ),
    addSummaryRow(
      pensionScheme,
      userCase?.claimantPensionContribution === YesOrNoOrNotSure.YES
        ? `${yes}: ${userCase.claimantPensionWeeklyContribution}`
        : no,
      createChangeAction(PageUrls.PENSION + InterceptPaths.ANSWERS_CHANGE, change, pensionScheme)
    ),
    addSummaryRow(
      benefits,
      userCase?.employeeBenefits === YesOrNo.YES ? `${yes}: ${userCase.benefitsCharCount}` : no,
      createChangeAction(PageUrls.BENEFITS + InterceptPaths.ANSWERS_CHANGE, change, benefits)
    )
  );
  if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
    rows.push(
      addSummaryRow(
        newJob,
        userCase.newJob,
        createChangeAction(PageUrls.NEW_JOB + InterceptPaths.ANSWERS_CHANGE, change, newJob)
      )
    );
    if (userCase.newJob === YesOrNo.YES) {
      rows.push(
        addSummaryRow(
          newStartDate,
          formatCaseDateDDMMYYYY(userCase.newJobStartDate) ?? '',
          createChangeAction(PageUrls.NEW_JOB_START_DATE + InterceptPaths.ANSWERS_CHANGE, change, newStartDate)
        ),
        addSummaryRow(
          newPayBeforeTax,
          userCase.newJobPay,
          createChangeAction(PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE, change, newPayBeforeTax)
        ),
        addSummaryRow(
          payPeriod,
          userCase.newJobPayInterval,
          createChangeAction(PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE, change, payPeriod)
        )
      );
    }
  }

  return rows;
};
