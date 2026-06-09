import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantSexAndTitleController from '../../../../main/controllers/non-hmcts/RepresentedClaimantSexAndTitleController';
import { Sex } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('RepresentedClaimantSexAndTitleController', () => {
  const t = {
    'non-hmcts/represented-claimant-sex-and-title': {},
    common: {},
  };

  it('should render represented claimant sex and preferred title page', () => {
    const controller = new RepresentedClaimantSexAndTitleController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.REPRESENTED_CLAIMANT_SEX_AND_TITLE, expect.anything());
  });

  describe('Correct validation', () => {
    it('should not allow numbers in the title', () => {
      const body = {
        claimantSex: Sex.MALE,
        preferredTitle: '5a',
      };

      const request = mockRequest({ body });
      const response = mockResponse();
      new RepresentedClaimantSexAndTitleController().post(request, response);

      const expectedErrors = [{ propertyName: 'preferredTitle', errorType: 'numberError' }];

      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(request.session.errors).toEqual(expectedErrors);
    });

    it('should not allow one character in other title', () => {
      const body = {
        claimantSex: Sex.MALE,
        preferredTitle: 'a',
      };

      const request = mockRequest({ body });
      const response = mockResponse();
      new RepresentedClaimantSexAndTitleController().post(request, response);

      const expectedErrors = [{ propertyName: 'preferredTitle', errorType: 'lengthError' }];

      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(request.session.errors).toEqual(expectedErrors);
    });
  });

  it('should clear fields', () => {
    const controller = new RepresentedClaimantSexAndTitleController();
    const response = mockResponse();
    const request = mockRequest({ t });
    request.session.userCase.claimantSex = Sex.MALE;
    request.session.userCase.preferredTitle = 'Mr.';

    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.claimantSex).toStrictEqual(undefined);
    expect(request.session.userCase.preferredTitle).toStrictEqual(undefined);
  });

  it('should assign userCase from the page form data and redirect to enter postcode', async () => {
    const body = {
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
    };
    const controller = new RepresentedClaimantSexAndTitleController();
    const request = mockRequestEmpty({ body });
    const response = mockResponse();

    await controller.post(request, response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_ENTER_POSTCODE);
    expect(request.session.userCase).toStrictEqual({
      claimantSex: Sex.MALE,
      preferredTitle: 'Mr',
    });
  });
});
