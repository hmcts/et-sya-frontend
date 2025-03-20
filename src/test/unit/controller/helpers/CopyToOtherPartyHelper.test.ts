import {
  getCaptionTextForCopyToOtherParty,
  getRedirectPageUrlNotSystemUser,
} from '../../../../main/controllers/helpers/CopyToOtherPartyHelper';
import { YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, Rule92Types } from '../../../../main/definitions/constants';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { mockRequest } from '../../mocks/mockRequest';

describe('getCaptionTextWithRequest', () => {
  const req = mockRequest({});
  const translations: AnyRecord = {
    respondToApplication: 'Respond to an application',
    respondToTribunal: 'Respond to the tribunal',
    sections: {
      'change-details': {
        caption: 'Change my personal details',
        label: 'I want to change my personal details',
        body: 'Change the personal details you gave when making your claim.',
      },
    },
  };

  it('should return CONTACT caption', () => {
    req.session.contactType = Rule92Types.CONTACT;
    req.session.userCase.contactApplicationType = 'change-details';
    const expected = 'Change my personal details';
    const actual = getCaptionTextForCopyToOtherParty(req, translations);
    expect(actual).toEqual(expected);
  });

  it('should return Respond caption', () => {
    req.session.contactType = Rule92Types.RESPOND;
    const expected = 'Respond to an application';
    const actual = getCaptionTextForCopyToOtherParty(req, translations);
    expect(actual).toEqual(expected);
  });

  it('should return Tribunal caption', () => {
    req.session.contactType = Rule92Types.TRIBUNAL;
    const expected = 'Respond to the tribunal';
    const actual = getCaptionTextForCopyToOtherParty(req, translations);
    expect(actual).toEqual(expected);
  });
});

describe('getRedirectPageUrlNotSystemUser', () => {
  it('should return CONTACT_THE_TRIBUNAL_CYA when copyToOtherPartyYesOrNo is NO and contactType is CONTACT', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.CONTACT;
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.CONTACT_THE_TRIBUNAL_CYA);
  });

  it('should return RESPONDENT_APPLICATION_CYA when copyToOtherPartyYesOrNo is NO and contactType is RESPOND', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.RESPOND;
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.RESPONDENT_APPLICATION_CYA);
  });

  it('should return TRIBUNAL_RESPONSE_CYA when copyToOtherPartyYesOrNo is NO and contactType is TRIBUNAL', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.TRIBUNAL;
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.TRIBUNAL_RESPONSE_CYA);
  });

  it('should return COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER when copyToOtherPartyYesOrNo is NO and contactType is unknown', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO };
    const req = mockRequest({ body });
    req.session.contactType = 'UNKNOWN_TYPE';
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER);
  });

  it('should return CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER when copyToOtherPartyYesOrNo is YES and contactType is CONTACT', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.CONTACT;
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER);
  });

  it('should return TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER when copyToOtherPartyYesOrNo is YES and contactType is RESPOND', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.RESPOND;
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER);
  });

  it('should return TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER when copyToOtherPartyYesOrNo is YES and contactType is TRIBUNAL', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.TRIBUNAL;
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER);
  });

  it('should return COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER when copyToOtherPartyYesOrNo is YES and contactType is unknown', () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };
    const req = mockRequest({ body });
    req.session.contactType = 'UNKNOWN_TYPE';
    expect(getRedirectPageUrlNotSystemUser(req)).toEqual(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER);
  });
});
