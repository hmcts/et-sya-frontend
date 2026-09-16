import ClaimSubmittedController from '../../../main/controllers/ClaimSubmittedController';
import { UNASSIGNED_OFFICE_EMAIL } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Submitted Controller', () => {
  const t = {
    'claim-submitted': {},
    common: {},
  };

  it('should use UNASSIGNED_OFFICE_EMAIL for Unassigned managing office', () => {
    const controller = new ClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.managingOffice = 'Unassigned';
    request.session.userCase.tribunalCorrespondenceEmail = 'other@justice.gov.uk';

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.emailText).toBe(UNASSIGNED_OFFICE_EMAIL);
  });

  it('should pass tribunal email for a named managing office', () => {
    const controller = new ClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.managingOffice = 'London Central';
    request.session.userCase.tribunalCorrespondenceEmail = 'londoncentralet@justice.gov.uk';

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.emailText).toBe('londoncentralet@justice.gov.uk');
  });

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
