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

const getTranslationsDidYouWorkFor = (pastEmployer: YesOrNo, translations: AnyRecord): string => {
  switch (pastEmployer) {
    case YesOrNo.YES:
      return translations.doYesOrNo.yes;
    case YesOrNo.NO:
      return translations.doYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

const getTranslationsIsStillWorking = (isStillWorking: StillWorking, translations: AnyRecord): string => {
  switch (isStillWorking) {
    case StillWorking.WORKING:
      return translations.employmentDetails.working;
    case StillWorking.NOTICE:
      return translations.employmentDetails.notice;
    case StillWorking.NO_LONGER_WORKING:
      return translations.employmentDetails.noLongerWorking;
    default:
      return translations.notProvided;
  }
};

const getTranslationsNoticePeriod = (noticePeriod: YesOrNo, translations: AnyRecord): string => {
  switch (noticePeriod) {
    case YesOrNo.YES:
      return translations.oesYesOrNo.yes;
    case YesOrNo.NO:
      return translations.oesYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

const getTranslationsNoticePeriodUnit = (noticePeriodUnit: WeeksOrMonths, translations: AnyRecord): string => {
  switch (noticePeriodUnit) {
    case WeeksOrMonths.MONTHS:
      return translations.employmentDetails.months;
    case WeeksOrMonths.WEEKS:
      return translations.employmentDetails.weeks;
    default:
      return translations.notProvided;
  }
};

const getTranslationsPayInterval = (payInterval: PayInterval, translations: AnyRecord): string => {
  switch (payInterval) {
    case PayInterval.ANNUAL:
      return translations.employmentDetails.annual;
    case PayInterval.MONTHLY:
      return translations.employmentDetails.monthly;
    case PayInterval.WEEKLY:
      return translations.employmentDetails.weekly;
    default:
      return translations.notProvided;
  }
};

const getTranslationsPensionScheme = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.claimantPensionContribution) {
    case YesOrNoOrNotSure.YES:
      return translations.oesYesOrNo.yes + ': ' + userCase.claimantPensionWeeklyContribution;
    case YesOrNoOrNotSure.NO:
      return translations.oesYesOrNo.no;
    case YesOrNoOrNotSure.NOT_SURE:
      return translations.notSure;
    default:
      return translations.notProvided;
  }
};

const getTranslationsEmployeeBenefits = (userCase: CaseWithId, translations: AnyRecord): string => {
  switch (userCase?.employeeBenefits) {
    case YesOrNo.YES:
      return translations.oesYesOrNo.yes + ': ' + userCase.benefitsCharCount;
    case YesOrNo.NO:
      return translations.oesYesOrNo.no;
    default:
      return translations.notProvided;
  }
};

export const getEmploymentDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const employmentDetails = [];

  employmentDetails.push({
    key: {
      text: translations.employmentDetails.header,
      classes: 'govuk-summary-list__key govuk-heading-m',
    },
    value: {},
  });

  if (userCase.pastEmployer !== YesOrNo.YES || !userCase.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL)) {
    employmentDetails.push(
      addSummaryRow(
        translations.employmentDetails.didYouWorkFor,
        getTranslationsDidYouWorkFor(userCase?.pastEmployer, translations),
        createChangeAction(
          PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.didYouWorkFor
        )
      )
    );
  }

  if (userCase.pastEmployer === YesOrNo.YES) {
    employmentDetails.push(
      addSummaryRow(
        translations.employmentDetails.isStillWorking,
        getTranslationsIsStillWorking(userCase?.isStillWorking, translations),
        createChangeAction(
          PageUrls.STILL_WORKING + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.isStillWorking
        )
      ),
      addSummaryRow(
        translations.employmentDetails.jobTitle,
        userCase.jobTitle ?? translations.notProvided,
        createChangeAction(
          PageUrls.JOB_TITLE + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.jobTitle
        )
      ),
      addSummaryRow(
        translations.employmentDetails.startDate,
        userCase.startDate
          ? userCase.startDate.day + '-' + userCase.startDate.month + '-' + userCase.startDate.year
          : translations.notProvided,
        createChangeAction(
          PageUrls.START_DATE + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.startDate
        )
      )
    );

    if (userCase.isStillWorking === StillWorking.NO_LONGER_WORKING) {
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.endDate,
          userCase.endDate
            ? userCase.endDate.day + '-' + userCase.endDate.month + '-' + userCase.endDate.year
            : translations.notProvided,
          createChangeAction(
            PageUrls.END_DATE + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.endDate
          )
        )
      );
    }

    if (
      userCase.isStillWorking === StillWorking.WORKING ||
      userCase.isStillWorking === StillWorking.NO_LONGER_WORKING
    ) {
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.noticePeriod,
          getTranslationsNoticePeriod(userCase?.noticePeriod, translations),
          createChangeAction(
            PageUrls.NOTICE_PERIOD + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.noticePeriod
          )
        )
      );
    }

    if (userCase.isStillWorking === StillWorking.NOTICE) {
      employmentDetails.push(
        addSummaryRow(
          translations.employmentDetails.noticeEnds,
          userCase.noticeEnds
            ? userCase.noticeEnds.day + '-' + userCase.noticeEnds.month + '-' + userCase.noticeEnds.year
            : translations.notProvided,
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
          getTranslationsNoticePeriodUnit(userCase?.noticePeriodUnit, translations),
          createChangeAction(
            PageUrls.NOTICE_TYPE + InterceptPaths.ANSWERS_CHANGE,
            translations.change,
            translations.employmentDetails.noticePeriodWeeksOrMonths
          )
        ),
        addSummaryRow(
          translations.employmentDetails.noticeLength,
          userCase.noticePeriodLength ?? translations.notProvided,
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
        userCase.avgWeeklyHrs ?? translations.notProvided,
        createChangeAction(
          PageUrls.AVERAGE_WEEKLY_HOURS + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.weeklyHours
        )
      ),
      addSummaryRow(
        translations.employmentDetails.payBeforeTax,
        userCase.payBeforeTax ?? translations.notProvided,
        createChangeAction(
          PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.payBeforeTax
        )
      ),
      addSummaryRow(
        translations.employmentDetails.payAfterTax,
        userCase.payAfterTax ?? translations.notProvided,
        createChangeAction(
          PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.payAfterTax
        )
      ),
      addSummaryRow(
        translations.employmentDetails.payPeriod,
        getTranslationsPayInterval(userCase?.payInterval, translations),
        createChangeAction(
          PageUrls.PAY + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.payPeriod
        )
      ),
      addSummaryRow(
        translations.employmentDetails.pensionScheme,
        getTranslationsPensionScheme(userCase, translations),
        createChangeAction(
          PageUrls.PENSION + InterceptPaths.ANSWERS_CHANGE,
          translations.change,
          translations.employmentDetails.pensionScheme
        )
      ),
      addSummaryRow(
        translations.employmentDetails.benefits,
        getTranslationsEmployeeBenefits(userCase, translations),
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
          userCase.newJob ?? translations.notProvided,
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
            userCase.newJobStartDate
              ? userCase.newJobStartDate.day +
                  '-' +
                  userCase.newJobStartDate.month +
                  '-' +
                  userCase.newJobStartDate.year
              : translations.notProvided,
            createChangeAction(
              PageUrls.NEW_JOB_START_DATE + InterceptPaths.ANSWERS_CHANGE,
              translations.change,
              translations.employmentDetails.newStartDate
            )
          ),
          addSummaryRow(
            translations.employmentDetails.newPayBeforeTax,
            userCase.newJobPay ?? translations.notProvided,
            createChangeAction(
              PageUrls.NEW_JOB_PAY + InterceptPaths.ANSWERS_CHANGE,
              translations.change,
              translations.employmentDetails.newPayBeforeTax
            )
          ),
          addSummaryRow(
            translations.employmentDetails.payPeriod,
            userCase.newJobPayInterval ?? translations.notProvided,
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
