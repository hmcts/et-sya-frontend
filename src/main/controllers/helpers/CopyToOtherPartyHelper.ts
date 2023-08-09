import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { PageUrls, Rule92Types } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';
import { getDueDate } from '../../helper/ApiFormatter';

import { checkIfRespondentIsSystemUser } from './CitizenHubHelper';

export const getTodayPlus7DaysStrings = (): string => {
  const today = new Date();
  return getDueDate(today.toString(), 7);
};

export const copyToOtherPartyRedirectUrl = (userCase: CaseWithId): string => {
  const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);
  return isRespondentSystemUser ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_CORRESPONDENCE_QUESTION;
};

export const getCaptionText = (req: AppRequest, translations: AnyRecord): string => {
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
