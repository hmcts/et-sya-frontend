import EndDateController from '../../../main/controllers/EndDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('End date Controller', () => {
  const t = {
    'end-date': {},
    common: {},
  };

  it('should render end date page', () => {
    const endDateController = new EndDateController();
    const response = mockResponse();
    const request = mockRequest({ t });

    endDateController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.END_DATE, expect.anything());
  });
});
