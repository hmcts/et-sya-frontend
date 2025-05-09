import ContactTheTribunalSelectedController from '../../../main/controllers/ContactTheTribunalSelectedController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import contactTheTribunalSelectedRaw from '../../../main/resources/locales/en/translation/contact-the-tribunal-selected.json';
import { mockFile } from '../mocks/mockFile';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Application Controller', () => {
  const t = {
    'contact-application-controller': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');
  const translationJsons = { ...contactTheTribunalSelectedRaw };

  beforeAll(async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
    jest.spyOn(helper, 'submitClaimantTse').mockImplementation(() => Promise.resolve());
    const uploadResponse: DocumentUploadResponse = {
      originalDocumentName: 'test.txt',
      uri: 'test.com',
      _links: {
        binary: {
          href: 'test.com',
        },
      },
    } as DocumentUploadResponse;

    (helperMock as jest.Mock).mockReturnValue({
      data: uploadResponse,
    });
  });

  it('should render contact application page', async () => {
    const controller = new ContactTheTribunalSelectedController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ t }, translationJsons);
    request.params.selectedOption = 'withdraw';

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, expect.anything());
  });

  describe('GET - application names', () => {
    it('allow white-listed application parameters', async () => {
      const req = mockRequestWithTranslation({ body: { contactApplicationText: 'test' } }, translationJsons);
      req.params.selectedOption = 'withdraw';
      const res = mockResponse();
      await new ContactTheTribunalSelectedController().get(req, res);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, expect.anything());
    });

    it('successful get with contact application file', async () => {
      const req = mockRequestWithTranslation({ body: { contactApplicationText: 'test' } }, translationJsons);
      req.session.userCase.contactApplicationFile = {
        document_binary_url: 'url',
        document_filename: 'file.pdf',
        document_url: 'url',
      };
      req.params.selectedOption = 'withdraw';
      const res = mockResponse();
      await new ContactTheTribunalSelectedController().get(req, res);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, expect.anything());
    });

    it('disallow non-white-listed application parameters', async () => {
      const req = mockRequest({ body: { contactApplicationText: 'test' } });
      req.params.selectedOption = 'not-allowed';
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().get(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_THE_TRIBUNAL + languages.ENGLISH_URL_PARAMETER);
    });
  });

  describe('Correct validation', () => {
    it('should require either summary text or summary file', async () => {
      const req = mockRequest({ body: { contactApplicationText: '' } });
      req.params.selectedOption = 'withdraw';
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'required' }]);
    });

    it('should not allow invalid free text size', async () => {
      const req = mockRequest({ body: { contactApplicationText: '1'.repeat(2501) } });
      req.params.selectedOption = 'withdraw';
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'tooLong' }]);
    });

    it('should only allow valid file formats', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      req.params.selectedOption = 'withdraw';
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileSize';
      const req = mockRequest({ body: {}, file: newFile });
      req.fileTooLarge = true;
      req.params.selectedOption = 'withdraw';
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileSize' }]);
    });

    it('should only allow valid file names', async () => {
      const newFile = mockFile;
      newFile.originalname = '$%?invalid.txt';
      const req = mockRequest({ body: {}, file: newFile });
      req.params.selectedOption = 'withdraw';
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileName' }]);
    });

    it('should assign values when clicking upload file for appropriate values', async () => {
      const req = mockRequest({
        body: { upload: true, contactApplicationText: 'test', contactApplicationFile: mockFile },
      });
      req.params.selectedOption = 'withdraw';
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        contactApplicationText: 'test',
        contactApplicationFile: {
          document_filename: 'test.txt',
        },
      });
    });

    it('should redirect to copy-to-other-party page when non-type-c application - in English language', async () => {
      const req = mockRequest({
        body: {
          upload: false,
          contactApplicationText: 'test',
          contactApplicationFile: mockFile,
        },
        userCase: {
          contactApplicationType: 'withdraw',
          respondents: [
            {
              ccdId: '1',
            },
          ],
          representatives: [
            {
              respondentId: '1',
              hasMyHMCTSAccount: YesOrNo.YES,
            },
          ],
        },
      });
      req.session.lang = languages.ENGLISH;
      req.params.selectedOption = 'withdraw';
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to copy-to-other-party page when non-type-c application - in Welsh language', async () => {
      const req = mockRequest({
        body: {
          upload: false,
          contactApplicationText: 'test',
          contactApplicationFile: mockFile,
        },
        userCase: {
          contactApplicationType: 'withdraw',
          respondents: [
            {
              ccdId: '1',
            },
          ],
          representatives: [
            {
              respondentId: '1',
              hasMyHMCTSAccount: YesOrNo.YES,
            },
          ],
        },
      });
      req.session.lang = languages.WELSH;
      req.params.selectedOption = 'withdraw';
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.WELSH_URL_PARAMETER);
    });

    it('should redirect to copy-to-other-party-not-system-user page when non-type-c application - English language', async () => {
      const req = mockRequest({
        body: {
          upload: false,
          contactApplicationText: 'test',
          contactApplicationFile: mockFile,
        },
        userCase: {
          contactApplicationType: 'withdraw',
        },
      });
      req.params.selectedOption = 'withdraw';
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to CYA page when type-c application - English language', async () => {
      const req = mockRequest({
        body: {
          upload: false,
          contactApplicationText: 'test',
          contactApplicationFile: mockFile,
        },
        userCase: {
          contactApplicationType: 'witness',
        },
      });
      req.session.lang = languages.ENGLISH;
      req.params.selectedOption = 'witness';
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_THE_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
    });
  });

  it('should redirect to CYA page when type-c application - Welsh language', async () => {
    const req = mockRequest({
      body: {
        upload: false,
        contactApplicationText: 'test',
        contactApplicationFile: mockFile,
      },
      userCase: {
        contactApplicationType: 'witness',
      },
    });
    req.session.lang = languages.WELSH;
    req.params.selectedOption = 'witness';
    const res = mockResponse();

    await new ContactTheTribunalSelectedController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_THE_TRIBUNAL_CYA + languages.WELSH_URL_PARAMETER);
  });

  it('should return error page when Selected application not found', async () => {
    const req = mockRequest({ body: { contactApplicationText: 'test' } });
    req.params.selectedOption = 'test';
    const res = mockResponse();
    await new ContactTheTribunalSelectedController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
