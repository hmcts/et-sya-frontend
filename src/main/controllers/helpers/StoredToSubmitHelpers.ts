import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const StoredToSubmitContentForm: FormContent = {
  fields: {
    confirmCopied: {
      id: 'confirmCopied',
      label: l => l.haveYouCopied,
      labelHidden: false,
      labelSize: 'm',
      type: 'checkboxes',
      hint: l => l.iConfirmThatIHaveCopied,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'confirmCopied',
          label: l => l.yesIConfirm,
          value: YesOrNo.YES,
        },
      ],
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.submitBtn,
  },
};
