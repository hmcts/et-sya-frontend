import GenderDetailsController from '../../../main/controllers/GenderDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Gender Details Controller', () => {
  const t = {
    'gender-details': {},
    common: {},
  };

  it('should render gender details page', () => {
    const genderDetailsController = new GenderDetailsController();
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.GENDER_DETAILS, expect.anything());
  });

  it('should assign userCase from the page form data', () => {
    const body = {
      gender: 'Male',
      genderIdentitySame: 'Yes',
      genderIdentity: '',
      preferredTitle: 'Mr',
    };
    const controller = new GenderDetailsController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ADDRESS_DETAILS);
    expect(req.session.userCase).toStrictEqual({
      gender: 'Male',
      genderIdentitySame: 'Yes',
      genderIdentity: '',
      preferredTitle: 'Mr',
    });
  });
});
