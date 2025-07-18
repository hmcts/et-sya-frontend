import ChangeLegalRepresentativeController from '../../../main/controllers/ChangeLegalRepresentativeController';
import { setUrlLanguage } from '../../../main/controllers/helpers/LanguageHelper';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const changeLegalRepresentativeController = new ChangeLegalRepresentativeController();

describe('ChangeLegalRepresentative Controller', () => {
  const t = {
    home: {},
  };

  it('should render the onboarding (home) page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.id = '1234567890123456';
    const citizenHubUrl = setUrlLanguage(request, TranslationKeys.CITIZEN_HUB + '/' + request.session.userCase.id);
    const contactTheTribunalUrl = setUrlLanguage(request, TranslationKeys.CONTACT_THE_TRIBUNAL + '/other');
    changeLegalRepresentativeController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, {
      ...(<AnyRecord>request.t(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, { returnObjects: true })),
      PageUrls,
      citizenHubUrl,
      contactTheTribunalUrl,
      languageParam: '?lng=en',
    });
  });
});
