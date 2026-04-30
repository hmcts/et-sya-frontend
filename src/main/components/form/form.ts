import { Case, CaseWithId } from '../../definitions/case';
import { FormContent, FormError, FormField, FormFields, FormInput, FormOptions } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

import { setupCheckboxParser } from './parser';

const WHITELISTED_FIELDS: string[] = ['_csrf'];

export class Form {
  constructor(private readonly fields: FormFields) {
    fields.hiddenErrorField = {
      id: 'hiddenErrorField',
      name: 'hiddenErrorField',
      hidden: true,
      type: 'text',
      label: (l: AnyRecord): string => l.hiddenErrorFieldLabel,
      labelHidden: true,
    };
  }

  /**
   * Pass the form body to any fields with a parser and return mutated body;
   */
  public getParsedBody<T = CaseWithId>(body: AnyRecord, checkFields?: FormContent['fields']): Partial<T> {
    const fields = checkFields || this.fields;
    const parsedBody = Object.entries(fields)
      .map(setupCheckboxParser(!!body?.saveForLater))
      .filter(([, field]) => typeof field?.parser === 'function')
      .flatMap(([key, field]: [string, FormField]) => {
        const parsed = field.parser?.(body);
        return Array.isArray(parsed) ? parsed : [[key, parsed]];
      });

    let subFieldsParsedBody = {};
    for (const [, value] of Object.entries(fields)) {
      (value as FormOptions)?.values
        ?.filter((option: FormInput) => option.subFields !== undefined)
        .map((fieldWithSubFields: FormInput) => fieldWithSubFields.subFields)
        .map((subField: AnyRecord) => this.getParsedBody(body, subField))
        .forEach((parsedSubField: CaseWithId) => {
          subFieldsParsedBody = { ...subFieldsParsedBody, ...parsedSubField };
        });
    }

    const formFieldValues = Object.keys(body)
      .filter(key => WHITELISTED_FIELDS.includes(key) || (fields as AnyRecord)[key])
      .reduce((newBody, key) => ({ [key]: body[key], ...newBody }), {});

    return {
      ...formFieldValues,
      ...subFieldsParsedBody,
      ...Object.fromEntries(parsedBody),
    };
  }

  /**
   * Pass the form body to any fields with a validator and return a list of errors
   */
  public getValidatorErrors(body: Partial<Case>): FormError[] {
    return Object.entries(this.fields).flatMap(fieldWithId => {
      return this.getErrorsFromField(body, ...fieldWithId);
    });
  }

  private getErrorsFromField(body: Partial<Case>, id: string, field: FormField): FormError[] {
    const errorType = field.validator && field.validator((body as AnyRecord)[id], body);
    const errors: FormError[] = [];

    if (errorType) {
      if (typeof errorType === 'object') {
        errors.push({
          errorType: errorType.error,
          propertyName: id,
          fieldName: errorType.fieldName,
        });
      } else {
        errors.push({ errorType: errorType as string, propertyName: id });
      }
    }

    // if there are checkboxes or options, check them for errors
    if (this.isFormOptions(field)) {
      const valuesErrors = field.values.flatMap(value => this.getErrorsFromField(body, value.name || id, value));

      errors.push(...valuesErrors);
    }
    // if there are subfields and the current field is selected then check for errors in the subfields
    else if (field.subFields && (body as AnyRecord)[id] === field.value) {
      const subFields = Object.entries(field.subFields);
      const subFieldErrors = subFields.flatMap(([subId, subField]) => this.getErrorsFromField(body, subId, subField));

      errors.push(...subFieldErrors);
    }

    return errors;
  }

  public getFieldNames(): Set<string> {
    const fields = this.fields;
    const fieldNames: Set<string> = new Set();
    for (const fieldKey in fields) {
      const stepField = (fields as AnyRecord)[fieldKey] as FormOptions;
      if (stepField.values && stepField.type !== 'date') {
        for (const [, value] of Object.entries(stepField.values)) {
          if (value.name) {
            fieldNames.add(value.name);
          } else {
            fieldNames.add(fieldKey);
          }
          if (value.subFields) {
            for (const field of Object.keys(value.subFields)) {
              fieldNames.add(field);
            }
          }
        }
      } else {
        fieldNames.add(fieldKey);
      }
    }

    return fieldNames;
  }

  public isComplete(body: Partial<AnyRecord>): boolean {
    for (const field of this.getFieldNames().values()) {
      if (body[field] === undefined || body[field] === null) {
        return false;
      }
    }

    return true;
  }

  public getFormFields(): FormFields {
    return this.fields;
  }

  private isFormOptions(field: FormField): field is FormOptions {
    return (field as FormOptions).values !== undefined;
  }
}
