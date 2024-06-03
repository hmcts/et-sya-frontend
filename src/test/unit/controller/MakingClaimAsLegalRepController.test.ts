import MakingClaimAsLegalRepController from '../../../main/controllers/MakingClaimAsLegalRepController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Litigation in Person or Representative Controller', () => {
  it("should render the 'representing myself (LiP) or using a representative choice' page", () => {
    const controller = new MakingClaimAsLegalRepController();
    const response = mockResponse();
    const request = mockRequest({});

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('making-claim-as-legal-representative', expect.anything());
  });
});
