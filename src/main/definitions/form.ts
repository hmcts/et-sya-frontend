import { Case, CaseDate } from './case';
import { AnyRecord } from './util-types';

type LanguageLookup = (lang: AnyRecord) => string;

export type ValidationCheck = (
  value: string | string[] | CaseDate | undefined | Case,
  formData: AnyRecord
) => void | string | InvalidField;

export type Parser = (value: Record<string, unknown> | string[]) => void;

export type Label = string | LanguageLookup;

export type Warning = Label;

export interface SubmitButton {
  text: Label;
  classes?: string;
  disabled?: boolean;
}

export interface CancelLink {
  text: Label;
  classes?: string;
  disabled?: boolean;
  href?: string;
}

export interface FormContent {
  submit?: SubmitButton;
  fields: FormFields | FormFieldsFn;
  saveForLater?: SubmitButton;
  continue?: SubmitButton;
  cancel?: CancelLink;
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
  labelAsHint?: boolean;
  isPageHeading?: boolean | null;
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
  label?: Label;
  labelHidden?: boolean;
  labelSize?: string | null;
  labelAsHint?: boolean;
  divider?: boolean;
  exclusive?: boolean;
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
  isCollapsable?: boolean | null;
  collapsableTitle?: Label;
  maxlength?: number | null;
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
