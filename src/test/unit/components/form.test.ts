import { areDateFieldsFilledIn } from '../../../main/components/form/date-validator';
import { Form } from '../../../main/components/form/form';
import { convertToDateObject } from '../../../main/components/form/parser';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { Case, CaseDate, Checkbox, YesOrNo } from '../../../main/definitions/case';
import { FormContent, FormFields, FormFieldsFn } from '../../../main/definitions/form';

describe('Form', () => {
  const mockForm: FormContent = {
    fields: {
      field: {
        type: 'radios',
        values: [
          { label: l => l.no, value: YesOrNo.YES },
          { label: l => l.yes, value: YesOrNo.NO },
        ],
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
      dateField: {
        type: 'date',
        values: [
          { label: l => l.dateFormat['day'], name: 'day' },
          { label: l => l.dateFormat['month'], name: 'month' },
          { label: l => l.dateFormat['year'], name: 'year' },
        ],
        parser: value => convertToDateObject('dateField', value as Record<string, unknown>),
        validator: value => areDateFieldsFilledIn(value as CaseDate),
      },
      checkboxes: {
        type: 'checkboxes',
        validator: isFieldFilledIn,
        values: [
          { name: 'checkboxes', label: () => 'checkbox1', value: 'checkbox1' },
          { name: 'checkboxes', label: () => 'checkbox2', value: 'checkbox2' },
        ],
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  const form = new Form(<FormFields>mockForm.fields);

  it('Should validate a form', async () => {
    const errors = form.getValidatorErrors({
      field: YesOrNo.YES,
      dateField: {
        day: '1',
        month: '1',
        year: '2000',
      },
      applicant1DoesNotKnowApplicant2EmailAddress: Checkbox.Checked,
      checkboxes: 'checkbox1',
    } as unknown as Case);

    expect((mockForm.fields as FormFields)['field'].validator).toHaveBeenCalledWith(YesOrNo.YES, {
      field: YesOrNo.YES,
      dateField: { day: '1', month: '1', year: '2000' },
      applicant1DoesNotKnowApplicant2EmailAddress: Checkbox.Checked,
      checkboxes: 'checkbox1',
    });
    expect(errors).toStrictEqual([]);
  });

  it('Should validate a textfield', async () => {
    const mockForm1: FormContent = {
      fields: {
        textField: {
          type: 'text',
          label: 'label1',
          value: 'value',
          validator: jest.fn().mockImplementation(isFieldFilledIn),
        },
      },
      submit: {
        text: l => l.continue,
      },
    };
    expect((mockForm1.fields as FormFields)['textField'].label).toEqual('label1');
  });

  it('Should validate a form and return error', async () => {
    const errors = form.getValidatorErrors({ dateField: {} } as unknown as Case);

    expect(errors).toStrictEqual([
      {
        propertyName: 'field',
        errorType: 'required',
      },
      {
        propertyName: 'dateField',
        fieldName: 'day',
        errorType: 'required',
      },
      {
        propertyName: 'checkboxes',
        errorType: 'required',
      },
    ]);
  });

  describe('subfield validation and parser', () => {
    const mockSubFieldForm: FormContent = {
      fields: {
        field: {
          type: 'radios',
          values: [
            {
              label: l => l.no,
              value: YesOrNo.NO,
              subFields: {
                testSubField: {
                  type: 'text',
                  label: 'Subfield',
                  validator: isFieldFilledIn,
                  values: [],
                },
                checkboxes: {
                  type: 'checkboxes',
                  validator: isFieldFilledIn,
                  values: [
                    {
                      name: 'checkboxes',
                      label: () => 'checkbox1',
                      value: 'checkbox1',
                    },
                    {
                      name: 'checkboxes',
                      label: () => 'checkbox2',
                      value: 'checkbox2',
                    },
                  ],
                },
              },
            },
            { label: l => l.yes, value: YesOrNo.YES, name: YesOrNo.YES },
          ],
          validator: isFieldFilledIn,
        },
      },
      submit: {
        text: l => l.continue,
      },
    };

    const subFieldForm = new Form(<FormFields>mockSubFieldForm.fields);

    it('returns the field error', () => {
      const errors = subFieldForm.getValidatorErrors({});

      expect(errors).toStrictEqual([
        {
          propertyName: 'field',
          errorType: 'required',
        },
      ]);
    });

    it('does not return any subfields error if the field has not been selected', () => {
      const errors = subFieldForm.getValidatorErrors({
        field: YesOrNo.YES,
      } as unknown as Case);

      expect(errors).toStrictEqual([]);
    });

    it('returns the subfield error when the field has been selected', () => {
      const errors = subFieldForm.getValidatorErrors({
        field: YesOrNo.NO,
      } as unknown as Case);

      expect(errors).toStrictEqual([
        {
          errorType: 'required',
          propertyName: 'testSubField',
        },
        {
          errorType: 'required',
          propertyName: 'checkboxes',
        },
      ]);
    });

    it('returns the parsed body of subfields', () => {
      const body = {
        field: YesOrNo.YES,
        testSubField: 'test',
        checkboxes: ['', '', 'checkbox1', 'checkbox2'],
      };

      expect(subFieldForm.getParsedBody(body)).toStrictEqual({
        field: YesOrNo.YES,
        testSubField: 'test',
        checkboxes: ['checkbox1', 'checkbox2'],
      });
    });
  });

  it('Should parse a form body', async () => {
    const body = {
      field: YesOrNo.YES,
      'dateField-day': '1',
      'dateField-month': '1',
      'dateField-year': '2000',
      checkboxes: ['', '', 'checkbox1', 'checkbox2'],
    };

    expect(form.getParsedBody(body)).toStrictEqual({
      field: 'Yes',
      dateField: {
        day: '1',
        month: '1',
        year: '2000',
      },
      checkboxes: ['checkbox1', 'checkbox2'],
    });
  });

  describe('checks if the form is complete', () => {
    it.each([
      { body: {}, expected: false },
      {
        body: {
          field: YesOrNo.YES,
          dateField: {
            day: '1',
            month: '1',
            year: '2000',
          },
          checkboxes: ['checkbox1'],
        },
        expected: true,
      },
    ])('checks if complete when %o', ({ body, expected }: { body: Record<string, unknown>; expected: boolean }) => {
      expect(form.isComplete(body)).toBe(expected);
    });
  });

  it('Should build a form with a custom field function', async () => {
    const mockFieldFnForm: FormContent = {
      fields: userCase => ({
        ...(userCase.dobDate
          ? {
              customQuestion: { type: 'text', label: 'custom', name: 'custom' },
            }
          : {}),
      }),
      submit: {
        text: l => l.continue,
      },
    };
    mockFieldFnForm.fields = mockFieldFnForm.fields as FormFieldsFn;

    const dobDate: CaseDate = {
      year: '2000',
      month: '12',
      day: '24',
    };
    const mockUserCase = { dobDate };
    const fieldFnForm = new Form(mockFieldFnForm.fields(mockUserCase));

    expect(fieldFnForm).toEqual({
      fields: {
        customQuestion: {
          label: 'custom',
          type: 'text',
          name: 'custom',
        },
      },
    });
  });
});
