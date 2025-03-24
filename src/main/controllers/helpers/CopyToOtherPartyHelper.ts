import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, Rule92Types } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getCaptionTextForCopyToOtherParty = (req: AppRequest, translations: AnyRecord): string => {
  const contactType = req.session.contactType;
  if (contactType === Rule92Types.CONTACT) {
    const captionSubject = req.session.userCase.contactApplicationType;
    return translations.sections[captionSubject]?.caption;
  }
  if (contactType === Rule92Types.RESPOND) {
    return translations.respondToApplication;
  }
  if (contactType === Rule92Types.TRIBUNAL) {
    return translations.respondToTribunal;
  }
  return '';
};

export const getRedirectPageUrlNotSystemUser = (req: AppRequest): string => {
  if (req.body.copyToOtherPartyYesOrNo === YesOrNo.NO) {
    switch (req.session.contactType) {
      case Rule92Types.CONTACT:
        return PageUrls.CONTACT_THE_TRIBUNAL_CYA;
      case Rule92Types.RESPOND:
        return PageUrls.RESPONDENT_APPLICATION_CYA;
      case Rule92Types.TRIBUNAL:
        return PageUrls.TRIBUNAL_RESPONSE_CYA;
      default:
        return PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
    }
  } else {
    switch (req.session.contactType) {
      case Rule92Types.CONTACT:
        return PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER;
      case Rule92Types.RESPOND:
        return PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER;
      case Rule92Types.TRIBUNAL:
        return PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER;
      default:
        return PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
    }
  }
};
