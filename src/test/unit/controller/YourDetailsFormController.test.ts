import YourDetailsFormController from '../../../main/controllers/YourDetailsFormController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { getCaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/services/CaseService');
const mockGetCaseApi = getCaseApi as jest.Mock;

describe('YourDetailsFormController', () => {
  const t = {
    'your-details-form': {},
    common: {},
  };

  beforeEach(() => {
    mockGetCaseApi.mockReturnValue({
      updateDraftCase: jest.fn().mockResolvedValue({
        data: {
          created_date: '2022-08-19T09:19:20.692655',
          last_modified: '2022-08-19T09:19:20.692655',
        },
      }),
      getCaseByApplicationRequest: jest.fn().mockResolvedValue({
        data: {
          ethosCaseReference: '123456/2025',
          id: '1234',
          case_data: {
            respondentCollection: [
              {
                value: {
                  respondent_name: 'Respondent Name',
                },
              },
            ],
          },
        },
      }),
    });
  });

  it('should render the your details form page', () => {
    const controller = new YourDetailsFormController();
    const response = mockResponse();
    const request = mockRequest({
      t,
      session: { visitedAssignClaimFlow: true, caseNumberChecked: true },
    });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_DETAILS_FORM, expect.anything());
  });

  it('should redirect to your details cya page when form is valid', async () => {
    const body = {
      ethosCaseReference: '1234567/2025',
      id: '1234567890123456',
      claimantName: 'John Test Doe',
    };
    const controller = new YourDetailsFormController();

    const req = mockRequest({
      body,
      session: { visitedAssignClaimFlow: true, caseNumberChecked: true },
    });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
  });

  it('should redirect back to self if there are errors', async () => {
    const errors = [
      { propertyName: 'ethosCaseReference', errorType: 'required' },
      { propertyName: 'id', errorType: 'required' },
      { propertyName: 'claimantName', errorType: 'required' },
    ];
    const body = { ethosCaseReference: '', id: '', claimantName: '' };
    const controller = new YourDetailsFormController();

    const req = mockRequest({
      body,
      session: { visitedAssignClaimFlow: true, caseNumberChecked: true },
    });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_FORM);
    expect(req.session.errors).toEqual(errors);
    expect(req.session.caseAssignmentFields.ethosCaseReference).toEqual('');
    expect(req.session.caseAssignmentFields.id).toEqual('');
    expect(req.session.caseAssignmentFields.claimantName).toEqual('');
  });

  it('should preserve claimantName when there are errors', async () => {
    const body = { ethosCaseReference: '', id: '', claimantName: 'John Test Doe' };
    const controller = new YourDetailsFormController();

    const req = mockRequest({
      body,
      session: { visitedAssignClaimFlow: true, caseNumberChecked: true },
    });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.caseAssignmentFields.ethosCaseReference).toEqual('');
    expect(req.session.caseAssignmentFields.id).toEqual('');
    expect(req.session.caseAssignmentFields.firstName).toEqual('John Test');
    expect(req.session.caseAssignmentFields.lastName).toEqual('Doe');
  });

  it('should redirect back to self with invalid case details error when case data is not found', async () => {
    mockGetCaseApi.mockReturnValue({
      getCaseByApplicationRequest: jest.fn().mockResolvedValue({ data: null }),
    });

    const body = {
      ethosCaseReference: '1234567/2025',
      id: '1234567890123456',
      claimantName: 'John Doe',
    };
    const controller = new YourDetailsFormController();

    const req = mockRequest({
      body,
      session: {
        visitedAssignClaimFlow: true,
        caseNumberChecked: true,
        yourDetailsVerified: true,
      },
    });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_FORM);
    expect(req.session.errors).toContainEqual({ propertyName: 'hiddenErrorField', errorType: 'invalidCaseDetails' });
    expect(req.session.caseAssignmentFields).toEqual({});
    expect(req.session.yourDetailsVerified).toBe(false);
  });

  it('should reject a direct POST when the assignment flow has not been completed', async () => {
    const getCaseByApplicationRequest = jest.fn();
    mockGetCaseApi.mockReturnValue({ getCaseByApplicationRequest });

    const controller = new YourDetailsFormController();
    const req = mockRequest({
      body: {
        ethosCaseReference: '1234567/2025',
        id: '1234567890123456',
        claimantName: 'John Doe',
      },
      session: { user: { accessToken: 'token' } },
    });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS + '?lng=en');
    expect(getCaseByApplicationRequest).not.toHaveBeenCalled();
    expect(req.session.caseAssignmentFields).toBeUndefined();
  });

  it('should reject a direct POST when the case number check has been skipped', async () => {
    const getCaseByApplicationRequest = jest.fn();
    mockGetCaseApi.mockReturnValue({ getCaseByApplicationRequest });

    const controller = new YourDetailsFormController();
    const req = mockRequest({
      body: {
        ethosCaseReference: '1234567/2025',
        id: '1234567890123456',
        claimantName: 'John Doe',
      },
      session: {
        user: { accessToken: 'token' },
        visitedAssignClaimFlow: true,
      },
    });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK + '?lng=en');
    expect(getCaseByApplicationRequest).not.toHaveBeenCalled();
    expect(req.session.caseAssignmentFields).toBeUndefined();
  });
});
