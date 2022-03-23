import DocumentsController from '../../../main/controllers/DocumentsController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Documents Controller', () => {
  const t = {
    documents: {},
    common: {},
  };

  it('should render the "I need documents in alternative format" page', () => {
    const controller = new DocumentsController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('generic-form-template', expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to the "I need documents" page when errors are present', () => {
      const errors = [{ propertyName: 'documents', errorType: 'required' }];
      const body = { documents: [''] };

      const controller = new DocumentsController();

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });
  });
});
