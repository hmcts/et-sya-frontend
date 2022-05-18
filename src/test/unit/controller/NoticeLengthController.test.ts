import NoticeLengthController from '../../../main/controllers/NoticeLengthController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice length Controller', () => {
  const t = {
    'notice-length': {},
    common: {},
  };

  it('should render notice length page', () => {
    const noticeLengthController = new NoticeLengthController();
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeLengthController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_LENGTH, expect.anything());
  });
});
