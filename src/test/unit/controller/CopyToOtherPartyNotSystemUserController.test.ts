import CopyToOtherPartyNotSystemUserController from '../../../main/controllers/CopyToOtherPartyNotSystemUserController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, Rule92Types, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import contactTheTribunalJsonRaw from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import copyJsonRaw from '../../../main/resources/locales/en/translation/copy-to-other-party.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Copy to other party not system user Controller', () => {
  const translationJsons = { ...contactTheTribunalJsonRaw, ...copyJsonRaw };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const controller = new CopyToOtherPartyNotSystemUserController();

  it('should render the copy to other party page', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.contactType = Rule92Types.CONTACT;
    request.session.userCase.contactApplicationType = 'withdraw';

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
      expect.objectContaining({
        applicationType: 'Withdraw my claim',
        cancelLink: '/citizen-hub/1234',
      })
    );
  });

  it('should render the copy to other party page for response', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.contactType = Rule92Types.RESPOND;

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
      expect.objectContaining({
        applicationType: 'Respond to an application',
        cancelLink: '/citizen-hub/1234',
      })
    );
  });

  it('should render the copy to other party page for tribunal', async () => {
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.contactType = Rule92Types.TRIBUNAL;

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER,
      expect.objectContaining({
        applicationType: 'Respond to the tribunal',
        cancelLink: '/citizen-hub/1234',
      })
    );
  });

  it('should redirect to contact the tribunal check your answers page when yes is selected', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };
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
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.CONTACT;
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_THE_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to tribunal check your answers page when yes is selected', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.YES };
    const req = mockRequest({ body });
    req.session.contactType = Rule92Types.TRIBUNAL;
    const res = mockResponse();
    req.params.languageParam = languages.ENGLISH;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.TRIBUNAL_RESPONSE_CYA_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to tribunal check your answers page when no is selected and summary text provided', async () => {
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: 'Test response' };
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

  it('should render the same page when No is selected but summary text exceeds 2500 characters', async () => {
    const errors = [{ propertyName: 'copyToOtherPartyText', errorType: 'tooLong' }];
    const body = { copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: '1'.repeat(2501), continue: true };
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
    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase.copyToOtherPartyYesOrNo).toEqual(YesOrNo.NO);
    expect(req.session.userCase.copyToOtherPartyText).toEqual('Test response');
  });
});
