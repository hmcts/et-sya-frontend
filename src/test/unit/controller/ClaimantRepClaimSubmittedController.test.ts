import ClaimantRepClaimSubmittedController from '../../../main/controllers/ClaimantRepClaimSubmittedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('ClaimantRepClaimSubmittedController', () => {
  const t = {
    'claimant-rep-claim-submitted': {},
    common: {},
  };

  it('should render the claimant rep claim submitted page', () => {
    const controller = new ClaimantRepClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_REP_CLAIM_SUBMITTED, expect.anything());
  });

  it('should move userCase to submittedCase and clear userCase', () => {
    const controller = new ClaimantRepClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = { id: 'case-999' } as any;

    controller.get(request, response);

    expect(request.session.submittedCase).toMatchObject({ id: 'case-999' });
    expect(request.session.userCase).toBeNull();
  });

  it('should render with tribunal office and email from submitted case', () => {
    const controller = new ClaimantRepClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = null;
    request.session.submittedCase = {
      id: 'case-111',
      managingOffice: 'London Central',
      tribunalCorrespondenceEmail: 'londoncentralet@justice.gov.uk',
      tribunalCorrespondenceTelephone: '0300 323 0196',
    } as any;

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.telephoneText).toBe('0300 323 0196');
    expect(renderArgs.emailText).toBe('londoncentralet@justice.gov.uk');
  });

  it('should use UNASSIGNED_OFFICE_EMAIL for Unassigned managing office', () => {
    const controller = new ClaimantRepClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = null;
    request.session.submittedCase = {
      id: 'case-222',
      managingOffice: 'Unassigned',
      tribunalCorrespondenceEmail: 'someother@justice.gov.uk',
    } as any;

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.emailText).toBe('employmentJurisdictionalSupportTeamInbox@justice.gov.uk');
  });

  it('should redirect to claimant-rep-hub with case id', () => {
    const controller = new ClaimantRepClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = null;
    request.session.submittedCase = { id: 'case-333' } as any;

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.redirectUrl).toContain('/claimant-rep-hub/case-333');
  });

  it('should show None when no attachment file', () => {
    const controller = new ClaimantRepClaimSubmittedController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase = null;
    request.session.submittedCase = { id: 'x', claimSummaryFile: undefined } as any;
    (request.t as unknown as jest.Mock).mockReturnValue({ none: 'None' });

    controller.get(request, response);

    const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
    expect(renderArgs.attachmentsText).toBe('None');
  });
});
