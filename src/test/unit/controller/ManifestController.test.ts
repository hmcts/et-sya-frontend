import ManifestController from '../../../main/controllers/ManifestController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const manifestController = new ManifestController();

describe('Manifest controller', () => {
  it('should set the manifest content type and send the manifest file', () => {
    const response = mockResponse();
    (response as any).sendFile = jest.fn();
    const request = mockRequest({});

    manifestController.get(request, response);

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/manifest+json');
    expect((response as any).sendFile).toHaveBeenCalledWith(expect.stringContaining('assets/manifest.json'));
  });
});
