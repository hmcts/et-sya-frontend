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
};

const formatDate = (rawDate: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(rawDate));

export const createRadioBtnsForAboutHearingDocs = (
  hearingCollection: HearingModel[]
): { name: string; label: string; value: string }[] =>
  hearingCollection
    .flatMap(hearing =>
      hearing.value.hearingDateCollection
        .filter(item => new Date(item.value.listedDate) > new Date())
        .map(item => ({
          label: `${hearing.value.Hearing_type} - ${hearing.value?.Hearing_venue?.value?.label} - ${formatDate(
            item.value.listedDate
          )}`,
          value: `HearingId=${hearing.id}&dateId=${item.id}`,
          name: 'hearingDocumentsAreFor',
        }))
    )
    .map((hearing, index) => ({
      ...hearing,
      label: `${index + 1} ${hearing.label}`,
    }));
