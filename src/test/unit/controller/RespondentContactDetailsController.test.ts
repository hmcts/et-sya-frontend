import RespondentContactDetailsController from '../../../main/controllers/RespondentContactDetailsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent Contact Details Controller', () => {
  let controller: RespondentContactDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);

  beforeEach(() => {
    controller = new RespondentContactDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the RESPONDENT_CONTACT_DETAILS page with expected data', async () => {
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTACT_DETAILS,
        expect.objectContaining({
          hideContactUs: true,
          contactDetailsList: expect.any(Array),
          welshEnabled: true,
        })
      );
    });
  });
});
