import RespondentSupportingMaterialController from '../../../main/controllers/RespondentSupportingMaterialController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { TranslationKeys } from '../../../main/definitions/constants';
import respondentSupportingMaterial from '../../../main/resources/locales/en/translation/respondent-supporting-material.json';
import { mockFile } from '../mocks/mockFile';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent supporting material controller', () => {
  const t = {
    'contact-application-controller': {},
    common: {},
  };
  const helperMock = jest.spyOn(helper, 'handleUploadDocument');
  const translationJsons = { ...respondentSupportingMaterial };

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

  it('should render respondent supporting material controller page', () => {
    const controller = new RespondentSupportingMaterialController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ t }, translationJsons);
    request.params.appId = '1';

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require either summary text or summary file', async () => {
      const req = mockRequest({ body: { respondToApplicationText: '' } });
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'respondToApplicationText', errorType: 'required' }]);
    });

    it('should not allow invalid free text size', async () => {
      const req = mockRequest({ body: { respondToApplicationText: '1'.repeat(2501) } });
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'respondToApplicationText', errorType: 'tooLong' }]);
    });

    it('should only allow valid file formats', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'supportingMaterialFile', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = mockFile;
      newFile.originalname = 'file.invalidFileSize';
      const req = mockRequest({ body: {}, file: newFile });
      req.fileTooLarge = true;
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'supportingMaterialFile', errorType: 'invalidFileSize' }]);
    });

    it('should only allow valid file names', async () => {
      const newFile = mockFile;
      newFile.originalname = '$%?invalid.txt';
      const req = mockRequest({ body: {}, file: newFile });
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'supportingMaterialFile', errorType: 'invalidFileName' }]);
    });

    it('should assign values when clicking upload file for appropriate values', async () => {
      const req = mockRequest({
        body: { upload: true, respondToApplicationText: 'test', supportingMaterialFile: mockFile },
      });
      const res = mockResponse();

      await new RespondentSupportingMaterialController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        respondToApplicationText: 'test',
        supportingMaterialFile: {
          document_filename: 'test.txt',
        },
      });
    });
  });
});
