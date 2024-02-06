import LinkedCasesController from '../../../main/controllers/LinkedCasesController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Linked Cases Controller', () => {
  const t = {
    'linked-cases': {},
    common: {},
  };
  it('should render the Linked Cases page', () => {
    const controller = new LinkedCasesController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('linked-cases', expect.anything());
  });

  describe('post() linked cases', () => {
    it('should redirect to the next page when nothing is selected as the form is optional', async () => {
      const body = {};

      const controller = new LinkedCasesController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_DETAILS_CHECK);
    });
  });

  it('should add linked cases form value to the userCase', async () => {
    const body = {
      linkedCases: 'Yes',
      linkedCasesDetail: 'Linked cases detail test text',
    };

    const controller = new LinkedCasesController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      linkedCases: 'Yes',
      linkedCasesDetail: 'Linked cases detail test text',
    });
  });
});
