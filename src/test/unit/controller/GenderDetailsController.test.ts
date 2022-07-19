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

  describe('should throw correct errors and stay on page', () => {
    it('should require mandatory fields', () => {
      const body = {
        gender: '',
        preferredTitle: '',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new GenderDetailsController().post(req, res);

      const expectedErrors = [
        { propertyName: 'gender', errorType: 'required' },
        { propertyName: 'preferredTitle', errorType: 'required' },
      ];

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should require other title given that preferred title is "other"', () => {
      const body = {
        gender: 'Male',
        preferredTitle: 'Other',
        otherTitlePreference: '',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new GenderDetailsController().post(req, res);

      const expectedErrors = [{ propertyName: 'otherTitlePreference', errorType: 'required' }];

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should not allow numbers in the other title', () => {
      const body = {
        gender: 'Male',
        preferredTitle: 'Other',
        otherTitlePreference: '5',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new GenderDetailsController().post(req, res);

      const expectedErrors = [{ propertyName: 'otherTitlePreference', errorType: 'numberError' }];

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });
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

  it('Should assign userCase for Other title', () => {
    const body = {
      gender: 'Male',
      genderIdentitySame: 'Yes',
      genderIdentity: '',
      preferredTitle: 'Other',
      otherTitlePreference: 'Pastor',
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
      preferredTitle: 'Other',
      otherTitlePreference: 'Pastor',
    });
  });
});
