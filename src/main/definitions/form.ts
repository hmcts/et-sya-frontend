import { Case, CaseDate } from './case';
import { AnyRecord, NeverRecord } from './util-types';

type LanguageLookup = (lang: NeverRecord) => string;

type ValidationCheck = (
  value: string | string[] | CaseDate | undefined | Case,
  formData: AnyRecord
) => void | string | InvalidField;

export type Parser = (value: Record<string, unknown> | string[]) => void;

export type Label = string | LanguageLookup;

export type Warning = Label;

export interface SubmitButton {
  text: Label;
  classes?: string;
}

export interface FormContent {
  submit: SubmitButton;
  fields: FormFields | FormFieldsFn;
  saveForLater?: SubmitButton;
  continue?: SubmitButton;
}

export type FormField = FormInput | FormOptions;
export type FormFields = Record<string, FormField>;
export type FormFieldsFn = (userCase: Partial<Case>) => FormFields;

export interface FormOptions {
  id?: string;
  type: string;
  label?: Label;
  labelHidden?: boolean;
  labelSize?: string | null;
  hideError?: boolean;
  values: FormInput[];
  attributes?: Partial<HTMLInputElement | HTMLTextAreaElement>;
  validator?: ValidationCheck;
  parser?: Parser;
  subFields?: Record<string, FormField>;
}

export interface FormInput {
  id?: string;
  name?: string;
  label: Label;
  hint?: Label;
  classes?: string;
  hidden?: boolean;
  selected?: boolean;
  value?: string | number;
  attributes?: Partial<HTMLInputElement | HTMLTextAreaElement>;
  validator?: ValidationCheck;
  parser?: Parser;
  warning?: Warning;
  conditionalText?: Label;
  subFields?: Record<string, FormField>;
  inputMode?: string;
  pattern?: string;
  spellCheck?: boolean;
}

export type FormError = {
  propertyName: string;
  errorType: string;
  fieldName?: string;
};

export type InvalidField = {
  error: string;
  fieldName: string;
};
