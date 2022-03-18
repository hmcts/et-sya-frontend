import NoticeEndController from '../../../main/controllers/NoticeEndController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice end Controller', () => {
  const t = {
    'notice-end': {},
    common: {},
  };

  it('should render notice end page', () => {
    const noticeEndController = new NoticeEndController();
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeEndController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());
  });
});
