import type { CaseFlags } from '../../definitions/case';
import type { AnyRecord } from '../../definitions/util-types';
import type { CUIFlag, CUIFlagDetails, CUIFlagItem, CUIFlagPath } from '../../services/CuiService';

const CUI_FLAG_OPTIONAL_FIELDS = [
  'subTypeValue',
  'subTypeValue_cy',
  'subTypeKey',
  'otherDescription',
  'otherDescription_cy',
  'flagComment',
  'flagComment_cy',
  'flagUpdateComment',
  'dateTimeModified',
  'status',
];

type ClaimantExternalFlagDetail = NonNullable<CaseFlags['details']>[number] | CUIFlagItem;
type ClaimantExternalFlagDetails = ClaimantExternalFlagDetail[];

export const buildCuiFlagDetails = (
  claimantExternalFlags: CaseFlags | undefined,
  partyName: string,
  roleOnCase: string
): CUIFlagDetails => {
  return {
    partyName,
    roleOnCase: claimantExternalFlags?.roleOnCase || roleOnCase,
    details: getExistingFlagDetails(claimantExternalFlags?.details),
  };
};

export const mergeClaimantExternalFlags = (
  existingFlags: CaseFlags | undefined,
  replacementFlags: CUIFlagDetails,
  partyName: string,
  roleOnCase: string
): CaseFlags => {
  const existingDetails: ClaimantExternalFlagDetails = existingFlags?.details ?? [];
  const replacementDetails: ClaimantExternalFlagDetails = replacementFlags.details ?? [];
  const details = replacementDetails.length ? mergeFlagDetails(existingDetails, replacementDetails) : existingDetails;

  return {
    ...existingFlags,
    ...replacementFlags,
    partyName: replacementFlags.partyName || partyName,
    roleOnCase: replacementFlags.roleOnCase || existingFlags?.roleOnCase || roleOnCase,
    details,
  } as unknown as CaseFlags;
};

const getExistingFlagDetails = (details: CaseFlags['details'] = []): CUIFlagItem[] => {
  return details.map(flagItem => {
    const cuiFlagItem = {
      value: getExistingFlagValue(flagItem.value as AnyRecord),
    } as Partial<CUIFlagItem>;

    if (flagItem.id) {
      cuiFlagItem.id = flagItem.id;
    }

    return cuiFlagItem as CUIFlagItem;
  });
};

const getExistingFlagValue = (flagValue: AnyRecord): CUIFlag => {
  const cuiFlag: AnyRecord = {
    name: flagValue.name ?? '',
    name_cy: flagValue.name_cy ?? '',
    dateTimeCreated: flagValue.dateTimeCreated ?? '',
    path: getExistingFlagPath(flagValue.path),
    hearingRelevant: flagValue.hearingRelevant ?? 'No',
    flagCode: flagValue.flagCode ?? '',
    availableExternally: flagValue.availableExternally ?? 'Yes',
  };

  CUI_FLAG_OPTIONAL_FIELDS.forEach(field => {
    if (flagValue[field] !== undefined) {
      cuiFlag[field] = flagValue[field];
    }
  });

  return cuiFlag as CUIFlag;
};

const getExistingFlagPath = (path: unknown): CUIFlagPath[] => {
  if (!Array.isArray(path)) {
    return [];
  }

  return path
    .map(pathItem => getExistingFlagPathItem(pathItem))
    .filter((pathItem): pathItem is CUIFlagPath => !!pathItem);
};

const getExistingFlagPathItem = (pathItem: unknown): CUIFlagPath | undefined => {
  const pathItemRecord = pathItem as AnyRecord;
  const id = pathItemRecord?.id ? { id: pathItemRecord.id } : {};

  if (pathItemRecord?.name) {
    return {
      ...id,
      name: pathItemRecord.name,
    };
  }

  if (typeof pathItemRecord?.value === 'string') {
    return {
      ...id,
      name: pathItemRecord.value,
    };
  }

  if (pathItemRecord?.value?.name) {
    return {
      ...id,
      name: pathItemRecord.value.name,
    };
  }

  return undefined;
};

const mergeFlagDetails = (
  existingDetails: ClaimantExternalFlagDetails = [],
  replacementDetails: ClaimantExternalFlagDetails = []
): ClaimantExternalFlagDetails => {
  const mergedDetails = [...existingDetails];

  replacementDetails.forEach(replacementDetail => {
    const existingIndex = replacementDetail?.id
      ? mergedDetails.findIndex(existingDetail => existingDetail.id === replacementDetail.id)
      : -1;

    if (existingIndex >= 0) {
      mergedDetails[existingIndex] = replacementDetail;
    } else {
      mergedDetails.push(replacementDetail);
    }
  });

  return mergedDetails;
};
