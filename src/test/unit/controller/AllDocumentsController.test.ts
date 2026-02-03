import AllDocumentsController from '../../../main/controllers/AllDocumentsController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { getCaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/services/CaseService');

describe('AllDocumentsController', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  const mockGetDocumentDetails = jest.fn();
  (getCaseApi as jest.Mock).mockReturnValue({
    getDocumentDetails: mockGetDocumentDetails,
  });

  beforeEach(() => {
    mockLdClient.mockResolvedValue(true);
    mockGetDocumentDetails.mockReset();
  });

  it('should render the All documents page', async () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const request = mockRequest({});
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ALL_DOCUMENTS, expect.anything());
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
            documentType: 'ET1',
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

  it('should populate createdOn from dateOfCorrespondence when present', async () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const userCase: Partial<CaseWithId> = {
      documentCollection: [
        {
          id: '1',
          value: {
            typeOfDocument: 'ET1',
            documentType: 'ET1',
            dateOfCorrespondence: '2023-01-01',
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

    expect(mockGetDocumentDetails).not.toHaveBeenCalled();
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ALL_DOCUMENTS,
      expect.objectContaining({
        allDocsSorted: expect.arrayContaining([
          expect.objectContaining({
            value: expect.objectContaining({
              uploadedDocument: expect.objectContaining({
                createdOn: '1 January 2023',
              }),
            }),
          }),
        ]),
      })
    );
  });

  it('should call caseApi.getDocumentDetails and populate createdOn when dateOfCorrespondence is missing', async () => {
    const controller = new AllDocumentsController();
    const response = mockResponse();
    const userCase: Partial<CaseWithId> = {
      documentCollection: [
        {
          id: '1',
          value: {
            typeOfDocument: 'ET1',
            documentType: 'ET1',
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

    // Mock the API to return a createdOn timestamp
    mockGetDocumentDetails.mockResolvedValue({ data: { createdOn: '2023-02-02T12:00:00.000Z' } });

    await controller.get(request, response);

    expect(mockGetDocumentDetails).toHaveBeenCalled();
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.ALL_DOCUMENTS,
      expect.objectContaining({
        allDocsSorted: expect.arrayContaining([
          expect.objectContaining({
            value: expect.objectContaining({
              uploadedDocument: expect.objectContaining({
                createdOn: '2 February 2023',
              }),
            }),
          }),
        ]),
      })
    );
  });
});
