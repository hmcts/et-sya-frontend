import SingleOrMultipleController from '../../../main/controllers/SingleOrMultipleController';
import { URLS } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const singleOrMultipleController = new SingleOrMultipleController();

describe('Single or Multiple Claim Controller', () => {
  const t = {
    'single-or-multiple-claim': {},
  };

  it('should render single or multiple claim page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    singleOrMultipleController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('single-or-multiple-claim', expect.anything());
  });

  it("should render the next page when 'single' is selected", () => {
    const response = mockResponse();
    const body = { 'single-or-multiple': 'single' };
    const request = mockRequest({ t, body });

    singleOrMultipleController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith('/do-you-have-an-acas-single-resps');
  });

  it("should render the legacy ET1 service when the 'making a claim for someone else' option is selected", () => {
    const response = mockResponse();
    const body = { 'single-or-multiple': 'multiple' };
    const request = mockRequest({ t, body });

    singleOrMultipleController.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(URLS.LEGACY_ET1);
  });

  it('should render same page if nothing selected', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    request.body = { 'single-or-multiple': '' };

    singleOrMultipleController.post(request, response);

    expect(response.render).toHaveBeenCalledWith('single-or-multiple-claim', expect.anything());
  });
});
