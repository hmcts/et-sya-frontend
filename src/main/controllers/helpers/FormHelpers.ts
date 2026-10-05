import { areBenefitsValid } from '../../components/form/validator';
import { HearingModel } from '../../definitions/api/caseApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo, YesOrNoOrNotSure } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { DefaultCurrencyFormFields } from '../../definitions/currency-fields';
import { TellUsWhatYouWant, TypesOfClaim } from '../../definitions/definition';
import { FormContent, FormField, FormFields, FormInput, FormOptions } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

import { mapSelectedRespondentValuesToCase } from './RespondentHelpers';

export const getTypeOfClaimFormValues = (): FormInput[] => [
  {
    id: 'discrimination',
    name: 'typeOfClaim',
    label: (l: AnyRecord): string => l.discrimination.checkbox,
    value: TypesOfClaim.DISCRIMINATION,
    hint: (l: AnyRecord): string => l.discrimination.hint,
  },
  {
    id: 'payRelatedClaim',
    name: 'typeOfClaim',
    label: (l: AnyRecord): string => l.payRelated.checkbox,
    value: TypesOfClaim.PAY_RELATED_CLAIM,
  },
  {
    id: 'unfairDismissal',
    name: 'typeOfClaim',
    label: (l: AnyRecord): string => l.unfairDismissal.checkbox,
    value: TypesOfClaim.UNFAIR_DISMISSAL,
    hint: (l: AnyRecord): string => l.unfairDismissal.hint,
  },
  {
    id: 'whistleBlowing',
    name: 'typeOfClaim',
    label: (l: AnyRecord): string => l.whistleBlowing.checkbox,
    value: TypesOfClaim.WHISTLE_BLOWING,
    hint: (l: AnyRecord): string => l.whistleBlowing.hint,
  },
];

export const getEmployeeBenefitsFormField = (): FormField => ({
  id: 'employee-benefits',
  type: 'radios',
  classes: 'govuk-radios',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  values: [
    {
      label: (l: AnyRecord): string => l.yes,
      value: YesOrNo.YES,
      subFields: {
        benefitsCharCount: {
          id: 'benefits-char-count',
          name: 'benefits-char-count',
          type: 'charactercount',
          label: (l: AnyRecord): string => l.hint,
          labelHidden: false,
          labelAsHint: true,
          maxlength: 2500,
          attributes: { maxLength: 2500 },
          validator: areBenefitsValid,
        },
      },
    },
    { label: (l: AnyRecord): string => l.no, value: YesOrNo.NO },
  ],
});

export const getPensionFormField = (id: string): FormField => ({
  id,
  type: 'radios',
  classes: 'govuk-radios',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'xl',
  isPageHeading: true,
  values: [
    {
      label: (l: AnyRecord): string => l.yes,
      value: YesOrNoOrNotSure.YES,
      subFields: {
        claimantPensionWeeklyContribution: {
          ...DefaultCurrencyFormFields,
          id: 'pension-contributions',
          label: (l: AnyRecord): string => l.pensionContributions,
          labelAsHint: true,
        },
      },
    },
    { label: (l: AnyRecord): string => l.no, value: YesOrNoOrNotSure.NO },
    { label: (l: AnyRecord): string => l.notSure, value: YesOrNoOrNotSure.NOT_SURE },
  ],
});

export const getTellUsWhatYouWantFormField = (): FormField => ({
  id: 'tellUsWhatYouWant',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  type: 'checkboxes',
  hint: (l: AnyRecord): string => l.selectAllHint,
  validator: null,
  values: [
    {
      id: 'compensationOnly',
      label: (l: AnyRecord): string => l.compensationOnly.checkbox,
      hint: (l: AnyRecord): string => l.compensationOnlyHint,
      value: TellUsWhatYouWant.COMPENSATION_ONLY,
    },
    {
      id: 'tribunalRecommendation',
      label: (l: AnyRecord): string => l.tribunalRecommendation.checkbox,
      hint: (l: AnyRecord): string => l.tribunalRecommendationHint,
      value: TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION,
    },
    {
      id: 'oldJob',
      label: (l: AnyRecord): string => l.oldJob.checkbox,
      value: TellUsWhatYouWant.OLD_JOB,
    },
    {
      id: 'anotherJob',
      label: (l: AnyRecord): string => l.anotherJob.checkbox,
      value: TellUsWhatYouWant.ANOTHER_JOB,
    },
  ],
});

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
  if (!hearing?.value) {
    return;
  }
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
