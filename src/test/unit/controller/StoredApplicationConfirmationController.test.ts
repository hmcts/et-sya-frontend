import StoredApplicationConfirmationController from '../../../main/controllers/StoredApplicationConfirmationController';
import { CaseWithId } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Store application Complete Controller tests', () => {
  const t = {
    'stored-application-confirmation': {},
    common: {},
  };
  const tseAppCollection = [
    {
      id: '1',
      value: {
        applicant: 'Claimant',
        date: '2022-05-05',
        type: 'Amend my claim',
        copyToOtherPartyText: 'Yes',
        details: 'Help',
        number: '1',
        status: 'Stored',
        applicationState: 'stored',
      },
    },
  ];
  const userCase: Partial<CaseWithId> = {
    genericTseApplicationCollection: tseAppCollection,
  };

  it('should render the Store application Complete page', () => {
    const controller = new StoredApplicationConfirmationController();
    const response = mockResponse();
    const request = mockRequest({ t, userCase });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.STORED_APPLICATION_CONFIRMATION, expect.anything());
  });
});
