import EndDateController from '../../../main/controllers/end_date/EndDateController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('End date Controller', () => {
  const t = {
    'end-date': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render end date page', () => {
    const endDateController = new EndDateController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    endDateController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.END_DATE, expect.anything());
  });
});
