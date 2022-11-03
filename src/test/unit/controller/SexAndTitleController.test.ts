import SexAndTitleController from '../../../main/controllers/SexAndTitleController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { Sex } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Sex and Title Controller', () => {
  it('should render sex and preferred title page', () => {
    const sexAndTitleController = new SexAndTitleController();
    const response = mockResponse();
    const request = mockRequest({});

    sexAndTitleController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.SEX_AND_TITLE, expect.anything());
  });

  describe('Correct validation', () => {
    it('should not allow numbers in the title', () => {
      const body = {
        claimantSex: Sex.MALE,
        preferredTitle: '5a',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new SexAndTitleController().post(req, res);

      const expectedErrors = [{ propertyName: 'preferredTitle', errorType: 'numberError' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should not allow one character in other title', () => {
      const body = {
        claimantSex: 'Male',
        preferredTitle: 'a',
      };

      const req = mockRequest({ body });
      const res = mockResponse();
      new SexAndTitleController().post(req, res);

      const expectedErrors = [{ propertyName: 'preferredTitle', errorType: 'lengthError' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });
  });

  it('should assign userCase from the page form data', () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
    };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));
    const controller = new SexAndTitleController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.ADDRESS_DETAILS);
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
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve({}));
    const controller = new SexAndTitleController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.ADDRESS_DETAILS);
    expect(req.session.userCase).toStrictEqual({
      claimantSex: Sex.MALE,
      preferredTitle: 'Pastor',
    });
  });
});
