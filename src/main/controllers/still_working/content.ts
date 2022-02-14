import { isFieldFilledIn } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { YesOrNo } from '../../definitions/case';

export const stillWorkingContent: FormContent = {
    fields: {
        isStillWorking: {
            classes: 'govuk-radios--inline',
            id: 'still-working',
            type: 'radios',
            label: (l: AnyRecord): string => l.label,
            values: [
                {
                    name: '',
                    label: (l: AnyRecord): string => l.optionText1,
                    value: YesOrNo.YES,
                    selected: false,
                },
                {
                    name: '',
                    label: (l: AnyRecord): string => l.optionText2,
                    value: YesOrNo.YES,
                    selected: false,
                },
                {
                    name: 'have_account',
                    label: (l: AnyRecord): string => l.optionText3,
                    value: YesOrNo.NO,
                    selected: false,
                },
            ],
            validator: isFieldFilledIn,
        },
    },
    submit: {
        text: (l: AnyRecord): string => l.continue,
        classes: 'govuk-!-margin-right-2',
      },
}


