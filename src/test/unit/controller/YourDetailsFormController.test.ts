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
      checkIdAndState: jest.fn().mockResolvedValue({ data: 'true' }),
      getCaseByApplicationRequest: jest.fn().mockResolvedValue({ data: { id: '1234' } }),
    });
  });

  it('should render the your details form page', () => {
    const controller = new YourDetailsFormController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_DETAILS_FORM, expect.anything());
  });

  it('should redirect to your details cya page when form is valid', async () => {
    const body = {
      id: '1234567890123456',
      claimantName: 'John Doe',
    };
    const controller = new YourDetailsFormController();

    const req = mockRequest({ body });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_CYA);
  });

  it('should redirect back to self if there are errors', async () => {
    const errors = [
      { propertyName: 'id', errorType: 'required' },
      { propertyName: 'claimantName', errorType: 'required' },
    ];
    const body = { caseReferenceId: '', claimantName: '' };
    const controller = new YourDetailsFormController();

    const req = mockRequest({ body });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_FORM);
    expect(req.session.errors).toEqual(errors);
    expect(req.session.userCase.claimantName).toEqual('');
  });

  it('should preserve claimantName when there are errors', async () => {
    const body = { caseReferenceId: '', claimantName: 'John Doe' };
    const controller = new YourDetailsFormController();

    const req = mockRequest({ body });
    req.url = PageUrls.YOUR_DETAILS_FORM;
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase.claimantName).toEqual('John Doe');
  });
});
