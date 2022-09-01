import { LoggerInstance } from 'winston';

import GenderDetailsController from '../../../main/controllers/GenderDetailsController';
import { Sex } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Gender Details Controller', () => {
  const t = {
    'gender-details': {},
    common: {},
  };

  const mockLogger = {} as unknown as LoggerInstance;

  it('should render gender details page', () => {
    const genderDetailsController = new GenderDetailsController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    genderDetailsController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.GENDER_DETAILS, expect.anything());
  });

  describe('Correct validation', () => {
    it('should not allow numbers in the title', () => {
      const body = {
        claimantSex: Sex.MALE,
        preferredTitle: '5a',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new GenderDetailsController(mockLogger).post(req, res);

      const expectedErrors = [{ propertyName: 'preferredTitle', errorType: 'numberError' }];

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should not allow one character in other title', () => {
      const body = {
        claimantSex: 'Male',
        preferredTitle: 'a',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new GenderDetailsController(mockLogger).post(req, res);

      const expectedErrors = [{ propertyName: 'preferredTitle', errorType: 'lengthError' }];

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });
  });

  it('should assign userCase from the page form data', () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
    };
    const controller = new GenderDetailsController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ADDRESS_DETAILS);
    expect(req.session.userCase).toStrictEqual({
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
    });
  });

  it('Should assign userCase for title', () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: 'Pastor',
    };
    const controller = new GenderDetailsController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.ADDRESS_DETAILS);
    expect(req.session.userCase).toStrictEqual({
      claimantSex: Sex.MALE,
      preferredTitle: 'Pastor',
    });
  });
});
