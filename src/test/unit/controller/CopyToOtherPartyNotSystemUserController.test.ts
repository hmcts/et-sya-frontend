import CopyToOtherPartyNotSystemUserController from '../../../main/controllers/CopyToOtherPartyNotSystemUserController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, Rule92Types, TranslationKeys, languages } from '../../../main/definitions/constants';
import contactTheTribunalJsonRaw from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import copyJsonRaw from '../../../main/resources/locales/en/translation/copy-to-other-party.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Copy to other party not system user Controller', () => {
  const t = {
    'copy-to-other-party': {},
    common: {},
  };

  it('should render the copy to other party page', () => {
    const translationJsons = { ...contactTheTribunalJsonRaw, ...copyJsonRaw };
    const controller = new CopyToOtherPartyNotSystemUserController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.contactType = Rule92Types.CONTACT;
    request.session.userCase.contactApplicationType = 'withdraw';

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
      expect.anything()
    );
  });

  it('should render the copy to other party page for response', () => {
    const controller = new CopyToOtherPartyNotSystemUserController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.contactType = Rule92Types.RESPOND;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
      expect.anything()
    );
  });

  it('should render the copy to other party page for tribunal', () => {
    const controller = new CopyToOtherPartyNotSystemUserController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.contactType = Rule92Types.TRIBUNAL;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
      expect.anything()
    );
  });

  it('should redirect to contact the tribunal check your answers page when yes is selected', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };

    const controller = new CopyToOtherPartyNotSystemUserController();

    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.CONTACT;
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to contact the tribunal check your answers page when no is selected and summary text provided', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: 'Test response' };

    const controller = new CopyToOtherPartyNotSystemUserController();

    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.CONTACT;

    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_THE_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to tribunal check your answers page when yes is selected', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };

    const controller = new CopyToOtherPartyNotSystemUserController();

    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.TRIBUNAL;
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.TRIBUNAL_RESPONSE_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to tribunal check your answers page when no is selected and summary text provided', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: 'Test response' };

    const controller = new CopyToOtherPartyNotSystemUserController();

    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.TRIBUNAL;

    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.TRIBUNAL_RESPONSE_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render the same page when nothing is selected', async () => {
    const errors = [{ propertyName: 'copyToOtherPartyYesOrNo', errorType: 'required' }];
    const body = { continue: true };

    const controller = new CopyToOtherPartyNotSystemUserController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the same page when No is selected but no summary text provided', async () => {
    const errors = [{ propertyName: 'copyToOtherPartyText', errorType: 'required' }];
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, continue: true };

    const controller = new CopyToOtherPartyNotSystemUserController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the same page when No is selected but summary text excess 2500', async () => {
    const errors = [{ propertyName: 'copyToOtherPartyText', errorType: 'tooLong' }];
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: '1'.repeat(2501), continue: true };

    const controller = new CopyToOtherPartyNotSystemUserController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the responses to the session userCase', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: 'Test response' };
    const controller = new CopyToOtherPartyNotSystemUserController();
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toEqual(YesOrNo.NO);
    expect(req.session.userCase.copyToOtherPartyText).toEqual('Test response');
  });
});