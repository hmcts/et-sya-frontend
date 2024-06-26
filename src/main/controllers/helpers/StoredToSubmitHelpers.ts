import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PseResponseType, SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { APP_TYPE_MAP } from '../../definitions/contact-applications';
import { FormContent } from '../../definitions/form';
import { AnyRecord, TypeItem } from '../../definitions/util-types';

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

export const findSelectedSendNotification = (
  items: SendNotificationTypeItem[],
  orderId: string
): SendNotificationTypeItem => {
  return items?.find(it => it.id === orderId);
};

export const findSelectedPseResponse = (
  response: TypeItem<PseResponseType>[],
  responseId: string
): TypeItem<PseResponseType> | undefined => {
  return response?.find(it => it.id === responseId);
};

export const putSelectedAppToUserCase = (userCase: CaseWithId): void => {
  const selectedApp = userCase.selectedGenericTseApplication.value;
  userCase.contactApplicationType = getAppTypeMapByValue(selectedApp.type);
  userCase.contactApplicationText = selectedApp.details;
  userCase.contactApplicationFile = selectedApp.documentUpload;
  userCase.copyToOtherPartyYesOrNo = selectedApp.copyToOtherPartyYesOrNo;
  userCase.copyToOtherPartyText = selectedApp.copyToOtherPartyText;
};

const getAppTypeMapByValue = (appKey: string): string => {
  for (const key in APP_TYPE_MAP) {
    if (APP_TYPE_MAP.hasOwnProperty(key)) {
      if (APP_TYPE_MAP[key] === appKey) {
        return key;
      }
    }
  }
  return undefined;
};

export const clearTseFields = (userCase: CaseWithId): void => {
  userCase.contactApplicationType = undefined;
  userCase.contactApplicationText = undefined;
  userCase.contactApplicationFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
  userCase.selectedGenericTseApplication = undefined;
  userCase.confirmCopied = undefined;
};
