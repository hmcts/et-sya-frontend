import { CaseDate } from '../../definitions/case';
import { FormField, FormOptions } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export type DateParser = (property: string, body: Record<string, unknown>) => CaseDate;

export const convertToDateObject: DateParser = (property, body) =>
  ['day', 'month', 'year'].reduce(
    (newDateObj: CaseDate, date: string) => {
      const propertyName = `${property}-${date}`;
      (newDateObj as AnyRecord)[date] = body[propertyName];
      delete body[propertyName];
      return newDateObj;
    },
    { day: '', month: '', year: '' }
  );

type CheckboxParser = (isSavingAndSigningOut: boolean) => ([key, field]: [string, FormField]) => [string, FormField];

export const setupCheckboxParser: CheckboxParser =
  (saveForLater = false) =>
  ([key, field]: [string, FormOptions]) => {
    if (field?.type === 'checkboxes') {
      field.parser = (formData: AnyRecord) => {
        const checkbox = formData[key] ?? [];
        let checkboxValues;
        if (field.values.length > 1) {
          checkboxValues = checkbox.filter(Boolean);
        } else {
          checkboxValues = checkbox[checkbox.length - 1];
        }

        if (saveForLater && !checkboxValues) {
          checkboxValues = null;
        }

        return [[key, checkboxValues]];
      };
    }
    return [key, field];
  };
