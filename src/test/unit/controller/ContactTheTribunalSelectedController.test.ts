import ContactTheTribunalSelectedController from '../../../main/controllers/ContactTheTribunalSelectedController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockFile } from '../mocks/mockFile';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Application Controller', () => {
  const t = {
    'contact-application-controller': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');

  beforeAll(() => {
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

  it('should render contact application page', () => {
    const controller = new ContactTheTribunalSelectedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.params.selectedOption = 'withdraw';

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, expect.anything());
  });

  describe('GET - application names', () => {
    it('allow white-listed application parameters', async () => {
      const req = mockRequest({ body: { contactApplicationText: 'test' } });
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
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_THE_TRIBUNAL);
    });
  });

  describe('Correct validation', () => {
    it('should require either summary text or summary file', async () => {
      const req = mockRequest({ body: { contactApplicationText: '' } });
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'required' }]);
    });

    it('should only allow valid file formats', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileSize';
      const req = mockRequest({ body: {}, file: newFile });
      req.fileTooLarge = true;
      await new ContactTheTribunalSelectedController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileSize' }]);
    });

    it('should assign values when clicking upload file for appropriate values', async () => {
      const req = mockRequest({
        body: { upload: true, contactApplicationText: 'test', contactApplicationFile: mockFile },
      });
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        contactApplicationText: 'test',
        contactApplicationFile: {
          document_filename: 'test.txt',
        },
      });
    });

    it('should reset values when clicking continue which submits the claim', async () => {
      const req = mockRequest({ body: { contactApplicationText: 'test', contactApplicationFile: mockFile } });
      const res = mockResponse();

      await new ContactTheTribunalSelectedController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        contactApplicationText: undefined,
        contactApplicationFile: undefined,
      });
    });
  });
});
