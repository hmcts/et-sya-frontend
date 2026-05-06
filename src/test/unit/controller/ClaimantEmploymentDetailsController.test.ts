import ClaimantEmploymentDetailsController from '../../../main/controllers/ClaimantEmploymentDetailsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantEmploymentDetailsController', () => {
  const t = {
    'claimant-employment-details': {},
    common: {},
  };

  it('should render the claimant employment details page', () => {
    const controller = new ClaimantEmploymentDetailsController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_EMPLOYMENT_DETAILS, expect.anything());
  });

  it('should redirect to CLAIMANT_EMPLOYMENT_START_DATE on save and continue', async () => {
    const body = { jobTitle: 'Software Engineer' };
    const controller = new ClaimantEmploymentDetailsController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_START_DATE);
  });

  it('should redirect to CLAIMANT_EMPLOYMENT_START_DATE when job title is empty', async () => {
    const body = { jobTitle: '' };
    const controller = new ClaimantEmploymentDetailsController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_START_DATE);
    expect(req.session.errors).toHaveLength(0);
  });

  it('should save job title to session userCase', async () => {
    const body = { jobTitle: 'Project Manager' };
    const controller = new ClaimantEmploymentDetailsController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ jobTitle: 'Project Manager' });
  });
});
