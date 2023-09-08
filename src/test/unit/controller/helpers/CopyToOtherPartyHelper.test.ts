import { getCaptionTextForCopyToOtherParty } from '../../../../main/controllers/helpers/CopyToOtherPartyHelper';
import { Rule92Types } from '../../../../main/definitions/constants';
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
