import RespondentSupportingMaterialController from '../../../main/controllers/RespondentSupportingMaterialController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import {
  NoticeOfECC,
  NotificationSubjects,
  PageUrls,
  Rule92Types,
  TranslationKeys,
  languages,
} from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import respondentSupportingMaterial from '../../../main/resources/locales/en/translation/respondent-supporting-material.json';
import { mockFile } from '../mocks/mockFile';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Respondent supporting material controller', () => {
  const t = {
    'respondent-supporting-material-controller': {},
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

  it('should render respondent supporting material controller page', async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
    const controller = new RespondentSupportingMaterialController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({ t }, translationJsons);
    request.params.appId = '1';

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SUPPORTING_MATERIAL, expect.anything());
  });

  it('should render Rule 92 page', async () => {
    const body = {
      responseText: 'some Text',
    };
    const userCase = {
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
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    const res = mockResponse();

    const controller = new RespondentSupportingMaterialController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render Rule 92 non system user page', async () => {
    const body = {
      responseText: 'some Text',
    };

    const request = mockRequestWithTranslation({ t, body }, translationJsons);
    const res = mockResponse();

    const controller = new RespondentSupportingMaterialController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith(
      PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should render tribunal response CYA page', async () => {
    const body = {
      responseText: 'some Text',
    };
    const userCase = mockUserCase;
    userCase.selectedRequestOrOrder = {
      id: '1',
      value: {
        sendNotificationSubject: [NotificationSubjects.ECC],
      },
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    request.session.contactType = Rule92Types.TRIBUNAL;
    const res = mockResponse();

    const controller = new RespondentSupportingMaterialController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.TRIBUNAL_RESPONSE_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render tribunal response CYA page if request type is CMO, ECC and Notice of ECC', async () => {
    const body = {
      responseText: 'some Text',
    };
    const userCase = mockUserCase;
    userCase.selectedRequestOrOrder = {
      id: '1',
      value: {
        sendNotificationSubject: [NotificationSubjects.ORDER_OR_REQUEST],
        sendNotificationEccQuestion: NoticeOfECC,
      },
    };

    const request = mockRequestWithTranslation({ t, body, userCase }, translationJsons);
    request.session.contactType = Rule92Types.TRIBUNAL;
    const res = mockResponse();

    const controller = new RespondentSupportingMaterialController();
    await controller.post(request, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.TRIBUNAL_RESPONSE_CYA + languages.ENGLISH_URL_PARAMETER);
  });

  describe('Correct validation', () => {
    it('should require either summary text or summary file', async () => {
      const req = mockRequest({ body: { responseText: '' } });
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'responseText', errorType: 'required' }]);
    });

    it('should not allow invalid free text size', async () => {
      const req = mockRequest({ body: { responseText: '1'.repeat(2501) } });
      await new RespondentSupportingMaterialController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'responseText', errorType: 'tooLong' }]);
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
        body: { upload: true, responseText: 'test', supportingMaterialFile: mockFile },
      });
      const res = mockResponse();

      await new RespondentSupportingMaterialController().post(req, res);

      expect(req.session.userCase).toMatchObject({
        responseText: 'test',
        supportingMaterialFile: {
          document_filename: 'test.txt',
        },
      });
    });
  });

  it('should return TRIBUNAL_RESPONSE_CYA', async () => {
    const req = mockRequest({
      body: { responseText: 'test' },
    });
    const res = mockResponse();
    req.session.contactType = Rule92Types.TRIBUNAL;
    req.session.userCase.selectedRequestOrOrder = {
      id: '1',
      value: {
        sendNotificationSubject: ['Employer Contract Claim'],
      },
    };
    await new RespondentSupportingMaterialController().post(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/tribunal-response-cya?lng=en');
  });

  it('should return COPY_TO_OTHER_PARTY', async () => {
    const req = mockRequest({
      body: { responseText: 'test' },
    });
    const res = mockResponse();
    req.session.userCase.respondents = [
      {
        ccdId: '1',
      },
    ];
    req.session.userCase.representatives = [
      {
        respondentId: '1',
        hasMyHMCTSAccount: YesOrNo.YES,
      },
    ];
    await new RespondentSupportingMaterialController().post(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
  });

  it('should return COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER', async () => {
    const req = mockRequest({
      body: { responseText: 'test' },
    });
    const res = mockResponse();
    await new RespondentSupportingMaterialController().post(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/copy-to-other-party-not-system-user?lng=en');
  });
});
