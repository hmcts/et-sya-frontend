import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { mockFile } from '../mocks/mockFile';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import ContactApplicationController from "../../../main/controllers/ContactApplicationController";
import {TranslationKeys} from "../../../main/definitions/constants";

describe('Contact Application Controller', () => {
  const t = {
    'contact-application-controller': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');

  beforeAll(() => {
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
    const controller = new ContactApplicationController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_APPLICATION, expect.anything());
  });

  describe('Correct validation', () => {
    it('should both summary text and summary file be optional', async () => {
      const req = mockRequest({ body: { contactApplicationText: '' } });
      await new ContactApplicationController().post(req, mockResponse());

      expect(req.session.errors.length).toEqual(0);
    });

    it('should only allow valid file formats', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      await new ContactApplicationController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileSize';
      const req = mockRequest({ body: {}, file: newFile });
      req.fileTooLarge = true;
      await new ContactApplicationController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'contactApplicationFile', errorType: 'invalidFileSize' }]);
    });

    it('should assign userCase from summary text', async () => {
      const req = mockRequest({ body: { contactApplicationText: 'test' } });
      const res = mockResponse();

      await new ContactApplicationController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        contactApplicationText: 'test',
      });
    });
  });
});
