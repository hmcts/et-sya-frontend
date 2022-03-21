import MultipleRespondentCheckController from '../../../main/controllers/MultipleRespondentCheckController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Mutiple Response Controller Tests', () => {
  const t = {
    'multiple-respondent-check': {},
    common: {},
  };

  it('should render multiple respondent page', () => {
    const controller = new MultipleRespondentCheckController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('multiple-respondent-check', expect.anything());
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'isMultipleRespondent', errorType: 'required' }];
    const body = { isMultipleRespondent: '' };
    const controller = new MultipleRespondentCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home if no errors', () => {
    const body = { isMultipleRespondent: YesOrNo.YES };
    const controller = new MultipleRespondentCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ACAS_MULTIPLE_CLAIM);
    expect(req.session.errors).toEqual([]);
  });
});
