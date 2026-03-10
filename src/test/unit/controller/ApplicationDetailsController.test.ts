import axios from 'axios';

import ApplicationDetailsController from '../../../main/controllers/ApplicationDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import applicationDetails from '../../../main/resources/locales/en/translation/application-details.json';
import common from '../../../main/resources/locales/en/translation/common.json';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Claimant Applications Controller', () => {
  const translationJsons = { ...applicationDetails, ...common };
  const t = {
    common: {},
  };

  it('should render the claimant application details page', async () => {
    const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
    mockLdClient.mockResolvedValue(true);
    const mockClient = jest.spyOn(CaseService, 'getCaseApi');
    mockClient.mockReturnValue(caseApi);
    const controller = new ApplicationDetailsController();

    const userCase: Partial<CaseWithId> = mockUserCase;
    userCase.genericTseApplicationCollection = mockGenericTseCollection;

    const response = mockResponse();
    const request = mockRequestWithTranslation({ t, userCase }, translationJsons);

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_DETAILS, expect.anything());
  });
});
