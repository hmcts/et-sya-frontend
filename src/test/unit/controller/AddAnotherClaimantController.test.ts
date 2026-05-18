import AddAnotherClaimantController from '../../../main/controllers/AddAnotherClaimantController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AddAdditionalClaimant } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWithRespondent } from '../mocks/mockUserCaseWithRespondent';

jest.spyOn(CaseHelper, 'handlePostLogic').mockImplementation(() => Promise.resolve());

describe('Add Another Claimant Controller', () => {
  const t = {
    addClaimantMethod: {},
    common: {},
  };

  it('should render the add another claimant page', () => {
    const controller = new AddAnotherClaimantController();

    const response = mockResponse();
    const request = mockRequest({ t });

    request.session.userCase = userCaseWithRespondent;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ADD_ANOTHER_CLAIMANT, expect.anything());
  });

  it('should redirect to other claimant personal details page when MANUAL is selected', async () => {
    const body = { addClaimantMethod: AddAdditionalClaimant.MANUAL };

    const controller = new AddAnotherClaimantController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    // handlePostLogic will be called with the target redirect URL determined by the controller
    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
      req,
      res,
      expect.anything(),
      expect.anything(),
      PageUrls.OTHER_CLAIMANT_PERSONAL_DETAILS
    );
  });

  it('should redirect to "#" when SPREADSHEET is selected', async () => {
    const body = { addClaimantMethod: AddAdditionalClaimant.SPREADSHEET };

    const controller = new AddAnotherClaimantController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(req, res, expect.anything(), expect.anything(), '#');
  });

  it('should fallback and redirect to "#" when no method is selected', async () => {
    const body = {};

    const controller = new AddAnotherClaimantController();

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = userCaseWithRespondent;

    await controller.post(req, res);

    expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(req, res, expect.anything(), expect.anything(), '#');
  });
});
