import ClaimSubmittedController from '../../../main/controllers/ClaimSubmittedController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Submitted Controller', () => {
  const t = {
    'claim-submitted': {},
    common: {},
  };

  it('should render the Claim Submitted page with file name', () => {
    const controller = new ClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.claimSummaryFile = {
      document_binary_url: '1010101',
      document_filename: 'document.pdf',
      document_url: 'document.com',
    };
    request.session.userCase.et1SubmittedForm = {
      id: '1010101',
      description: 'ET1Form_Joe_Bloggs.pdf',
      type: 'ET1Form_Joe_Bloggs.com',
    };
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('claim-submitted', expect.anything());
  });
});
