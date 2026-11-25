import GuidanceController from '../../../../main/controllers/multiples/GuidanceController';
import { PageUrls, Views } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

const guidanceController = new GuidanceController();

describe('Guidance controller', () => {
  const t = {
    guidance: {},
    common: {},
  };

  it('should render the guidance page with claim steps returnUrl when no userCase session', () => {
    const response = mockResponse();
    const request = mockRequest({ t, session: { userCase: undefined } });

    guidanceController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      Views.MULTIPLE_GUIDANCE,
      expect.objectContaining({
        returnUrl: `${PageUrls.CLAIM_STEPS}?lng=en`,
      })
    );
  });

  it('should render the guidance page with citizen hub returnUrl when userCase session exists', () => {
    const response = mockResponse();
    const request = mockRequest({
      t,
      session: {
        userCase: {
          id: '12345',
        },
      },
    });

    guidanceController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      Views.MULTIPLE_GUIDANCE,
      expect.objectContaining({
        returnUrl: `${PageUrls.CITIZEN_HUB}/12345?lng=en`,
      })
    );
  });
});
