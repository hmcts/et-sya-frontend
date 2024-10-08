import ChecklistController from '../../../main/controllers/ChecklistController';
import { setUrlLanguage } from '../../../main/controllers/helpers/LanguageHelper';
import { PageUrls } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const checklistController = new ChecklistController();

describe('Checklist Controller', () => {
  const t = {
    checklist: {},
  };

  it('should render the checklist page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    const redirectUrl = setUrlLanguage(request, PageUrls.LIP_OR_REPRESENTATIVE);
    checklistController.get(request, response);
    expect(response.render).toHaveBeenCalledWith('checklist', {
      ...(<AnyRecord>request.t('checklist', { returnObjects: true })),
      PageUrls,
      redirectUrl,
    });
  });
});
