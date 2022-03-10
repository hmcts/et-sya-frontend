import NoticeEndController from '../../../main/controllers/notice_end/NoticeEndController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Notice end Controller', () => {
  const t = {
    'notice-end': {},
    common: {},
  };

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  it('should render notice end page', () => {
    const noticeEndController = new NoticeEndController(mockFormContent);
    const response = mockResponse();
    const request = mockRequest({ t });

    noticeEndController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTICE_END, expect.anything());
  });
});
