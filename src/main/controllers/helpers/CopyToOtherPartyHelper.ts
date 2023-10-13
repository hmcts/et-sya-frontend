import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, Rule92Types } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getCaptionTextForCopyToOtherParty = (req: AppRequest, translations: AnyRecord): string => {
  let captionText = '';
  const contactType = req.session.contactType;
  if (contactType === Rule92Types.CONTACT) {
    const captionSubject = req.session.userCase.contactApplicationType;
    captionText = translations.sections[captionSubject]?.caption;
  }
  if (contactType === Rule92Types.RESPOND) {
    captionText = translations.respondToApplication;
  }
  if (contactType === Rule92Types.TRIBUNAL) {
    captionText = translations.respondToTribunal;
  }
  return captionText;
};

export const getRedirectPageUrlNotSystemUser = (req: AppRequest): string => {
  if (req.body.copyToOtherPartyYesOrNo === YesOrNo.NO) {
    if (req.session.contactType === Rule92Types.CONTACT) {
      return PageUrls.CONTACT_THE_TRIBUNAL_CYA;
    } else if (req.session.contactType === Rule92Types.TRIBUNAL) {
      return PageUrls.TRIBUNAL_RESPONSE_CYA;
    }
  } else {
    if (req.session.contactType === Rule92Types.CONTACT) {
      return PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER;
    } else if (req.session.contactType === Rule92Types.TRIBUNAL) {
      return PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER;
    }
  }
  return PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER;
};
