import AllDocumentsController from '../../../main/controllers/AllDocumentsController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('AllDocumentsController', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockLdClient.mockResolvedValue(true);
  });

  it('should render the All documents page', async () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const request = mockRequest({});
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ALL_DOCUMENTS, expect.anything());
  });

  it('should populate shortDescription from typeOfDocument when shortDescription is missing', async () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const userCase: Partial<CaseWithId> = {
      documentCollection: [
        {
          id: '1',
          value: {
            typeOfDocument: 'ET1',
            uploadedDocument: {
              document_filename: 'test.pdf',
              document_url: 'http://test.com/test.pdf',
              document_binary_url: 'http://test.com/binary/test.pdf',
            },
          },
        },
      ],
    };
    const request = mockRequest({ userCase });
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ALL_DOCUMENTS,
      expect.objectContaining({
        allDocsSorted: expect.arrayContaining([
          expect.objectContaining({
            value: expect.objectContaining({
              shortDescription: 'ET1',
            }),
            downloadLink: expect.stringContaining('test.pdf'),
          }),
        ]),
      })
    );
  });

  it('should create download links for all documents', async () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const userCase: Partial<CaseWithId> = {
      documentCollection: [
        {
          id: '1',
          value: {
            typeOfDocument: 'ET1',
            shortDescription: 'My ET1 form',
            uploadedDocument: {
              document_filename: 'et1.pdf',
              document_url: 'http://test.com/et1.pdf',
              document_binary_url: 'http://test.com/binary/et1.pdf',
            },
          },
        },
      ],
    };
    const request = mockRequest({ userCase });
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ALL_DOCUMENTS,
      expect.objectContaining({
        allDocsSorted: expect.arrayContaining([
          expect.objectContaining({
            downloadLink: expect.stringContaining('et1.pdf'),
          }),
        ]),
      })
    );
  });
});
