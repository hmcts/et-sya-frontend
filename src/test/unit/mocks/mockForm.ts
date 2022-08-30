import { Form } from '../../../main/components/form/form';
import { FormField, ValidationCheck } from '../../../main/definitions/form';
export const mockForm = (fields: Record<string, FormField>): Form => {
  return new Form(fields);
};

export const mockFormField = (
  id: string,
  name: string,
  type: string,
  value: string | number,
  validator: ValidationCheck,
  label: string
): FormField => {
  return {
    id,
    name,
    type,
    value,
    validator,
    label,
  };
};

export const mockValidationCheckWithRequiredError = (): ValidationCheck => {
  return jest.fn().mockReturnValue('required');
};

export const mockValidationCheckWithOutError = (): ValidationCheck => {
  return jest.fn().mockReturnValue(undefined);
};
