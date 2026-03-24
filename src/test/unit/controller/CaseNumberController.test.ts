import CaseNumberController from '../../../main/controllers/CaseNumberController';
import { PageUrls } from '../../../main/definitions/constants';
import { getCaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/services/CaseService');
const mockGetCaseApi = getCaseApi as jest.Mock;

describe('CaseNumberController', () => {
  const t = {
    'case-number-check': {},
    common: {},
  };

  beforeEach(() => {
    mockGetCaseApi.mockReturnValue({
      checkEthosCaseReference: jest.fn().mockResolvedValue({ data: 'true' }),
    });
  });

  it('should render the case-number-check page', () => {
    const controller = new CaseNumberController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('case-number-check', expect.anything());
  });

  it('should redirect back to self if there are errors', async () => {
    const errors = [{ propertyName: 'ethosCaseReference', errorType: 'required' }];
    const body = { ethosCaseReference: '' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    req.session.visitedAssignClaimFlow = true;
    req.url = PageUrls.CASE_NUMBER_CHECK;
    const res = mockResponse();

    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home page when case number is provided', async () => {
    const body = { ethosCaseReference: '1234567/2023' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalled();
    expect(req.session.errors).toHaveLength(0);
  });

  it('should save case number to user case', async () => {
    const body = { ethosCaseReference: '1234567/2023' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.caseAssignmentFields.ethosCaseReference).toBe('1234567/2023');
  });

  it('should set isAssignClaim flag when case number is valid', async () => {
    const body = { ethosCaseReference: '1234567/2023' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.isAssignClaim).toBe(true);
  });

  it('should redirect back to self with error when case is not found', async () => {
    mockGetCaseApi.mockReturnValue({
      checkEthosCaseReference: jest.fn().mockResolvedValue({ data: 'false' }),
    });

    const body = { ethosCaseReference: '1234567/2023' };
    const controller = new CaseNumberController();

    const req = mockRequest({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalled();
    expect(req.session.errors).toContainEqual({ propertyName: 'ethosCaseReference', errorType: 'caseNotFound' });
  });
});
