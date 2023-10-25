import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { PseResponseType, SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { FormContent } from '../../definitions/form';
import { SummaryListRow, addSummaryHtmlRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord, TypeItem } from '../../definitions/util-types';

import { getSupportingMaterialDownloadLink } from './ApplicationDetailsHelper';

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
  items: SendNotificationTypeItem,
  responseId: string
): TypeItem<PseResponseType> | undefined => {
  return items.value.respondCollection?.find(it => it.id === responseId);
};

export const getPseResponseDisplay = async (
  responseItem: TypeItem<PseResponseType>,
  translations: AnyRecord,
  accessToken: string
): Promise<SummaryListRow[]> => {
  const response = responseItem.value;
  const rows: SummaryListRow[] = [];
  rows.push(addSummaryRow(translations.responder, response.from));
  rows.push(addSummaryRow(translations.responseDate, response.date));
  rows.push(addSummaryRow(translations.legend, response.response));
  rows.push(
    addSummaryHtmlRow(
      translations.supportingMaterial,
      await getSupportingMaterialDownloadLink(
        response.supportingMaterial?.find(element => element !== undefined).value.uploadedDocument,
        accessToken
      )
    )
  );
  rows.push(addSummaryRow(translations.copyToOtherPartyYesOrNo, response.copyToOtherParty));
  return rows;
};
