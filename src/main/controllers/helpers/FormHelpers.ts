import { HearingModel } from '../../definitions/api/caseApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo, YesOrNoOrNotSure } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { FormContent, FormField, FormFields, FormInput, FormOptions } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

import { mapSelectedRespondentValuesToCase } from './RespondentHelpers';

export const getPageContent = (
  req: AppRequest,
  formContent: FormContent,
  translations: string[] = [],
  selectedRespondentIndex?: number
): AnyRecord => {
  const sessionErrors = req.session?.errors || [];
  const userCase = req.session?.userCase;
  mapSelectedRespondentValuesToCase(selectedRespondentIndex, userCase);

  let content = {
    form: formContent,
    sessionErrors,
    userCase,
    PageUrls,
  };
  translations.forEach(t => {
    content = { ...content, ...req.t(t, { returnObjects: true }) };
  });
  return content;
};

export const assignFormData = (userCase: CaseWithId | undefined, fields: FormFields): void => {
  if (!userCase) {
    userCase = <CaseWithId>{};
    return;
  }

  Object.entries(fields).forEach(([name, field]: [string, FormOptions]) => {
    const caseName = (userCase as AnyRecord)[name];
    if (caseName) {
      field.values = field.values?.map(v => {
        Object.keys(caseName).forEach(key => {
          if (v.name === key) {
            v.value = caseName[key];
          }
        });
        return v;
      });
      for (const [, value] of Object.entries(fields)) {
        (value as FormOptions)?.values
          ?.filter((option: FormInput) => option.subFields !== undefined)
          .map((fieldWithSubFields: FormInput) => fieldWithSubFields.subFields)
          .forEach((subField: Record<string, FormField>) => assignFormData(caseName, subField));
      }
    }
  });
};

export const assignAddresses = (userCase: CaseWithId | undefined, fields: FormFields): void => {
  if (!userCase) {
    userCase = <CaseWithId>{};
    return;
  }
  Object.entries(fields).forEach(([name, field]: [string, FormOptions]) => {
    const caseName = (userCase as AnyRecord)[name];
    if (caseName) {
      field.values = caseName;
    }
  });
};

export const trimFormData = (formData: Partial<CaseWithId>): void => {
  (Object.keys(formData) as (keyof typeof formData)[]).forEach(key => {
    const value = formData[key];
    if (typeof value === 'string') {
      (formData as AnyRecord)[key] = value.trim();
    }
  });
};

export const resetValuesIfNeeded = (formData: Partial<CaseWithId>): void => {
  if (
    formData.claimantPensionContribution === YesOrNoOrNotSure.NO ||
    formData.claimantPensionContribution === YesOrNoOrNotSure.NOT_SURE
  ) {
    formData.claimantPensionWeeklyContribution = undefined;
  }
  if (formData.employeeBenefits === YesOrNo.NO) {
    formData.benefitsCharCount = undefined;
  }
  if (formData.noticePeriod === YesOrNo.NO) {
    formData.noticePeriodUnit = undefined;
    formData.noticePeriodLength = undefined;
  }
  if (formData.newJob === YesOrNo.NO) {
    formData.newJobStartDate = undefined;
    formData.newJobPay = undefined;
    formData.newJobPayInterval = undefined;
  }
  if (formData.linkedCases === YesOrNo.NO) {
    formData.linkedCasesDetail = undefined;
  }
};

const formatDate = (rawDate: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(rawDate));

export const createLabelForHearing = (hearing: HearingModel): string => {
  // filter out hearings with dates in the past
  // hearings can have multiple dates set so
  // reduce to find the earliest date set for that particular hearing
  const hearingsInFuture = hearing.value.hearingDateCollection.filter(
    item => new Date(item.value.listedDate) > new Date() && item.value.Hearing_status === 'Listed'
  );

  if (!hearingsInFuture.length) {
    return;
  }
  const earliestDate = hearingsInFuture.reduce((a, b) =>
    new Date(a.value.listedDate) > new Date(b.value.listedDate) ? b : a
  );
  const venue = hearing.value?.Hearing_venue_Scotland || hearing.value?.Hearing_venue?.value?.label;
  return `${hearing.value.hearingNumber ?? ''} ${hearing.value.Hearing_type ?? ''} - ${venue ?? ''} - ${formatDate(
    earliestDate.value.listedDate
  )}`;
};

export const createRadioBtnsForHearings = (
  hearingCollection: HearingModel[]
): { name: string; label: string; value: string }[] | undefined => {
  const filtered = hearingCollection.filter(hearing => !!createLabelForHearing(hearing));
  if (!filtered.length) {
    return;
  }
  return filtered.map(hearing => ({
    label: createLabelForHearing(hearing),
    value: hearing.id,
    name: 'hearingDocumentsAreFor',
  }));
};
