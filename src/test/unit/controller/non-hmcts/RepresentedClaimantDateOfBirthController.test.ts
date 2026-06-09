import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantDateOfBirthController from '../../../../main/controllers/non-hmcts/RepresentedClaimantDateOfBirthController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('RepresentedClaimantDateOfBirthController', () => {
  const t = {
    'non-hmcts/represented-claimant-date-of-birth': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the represented claimant date of birth page', () => {
      const controller = new RepresentedClaimantDateOfBirthController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.REPRESENTED_CLAIMANT_DATE_OF_BIRTH,
        expect.anything()
      );
    });
  });

  describe('post()', () => {
    it('should redirect to the same screen when errors are present', () => {
      const request = mockRequest({
        body: {
          'representedClaimantDateOfBirth-day': 'a',
        },
      });
      const response = mockResponse();
      new RepresentedClaimantDateOfBirthController().post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(request.path);
    });

    it('should update draft case when date is submitted', async () => {
      const body = {
        'representedClaimantDateOfBirth-day': '05',
        'representedClaimantDateOfBirth-month': '11',
        'representedClaimantDateOfBirth-year': '2000',
      };
      const request = mockRequestEmpty({ body });
      const controller = new RepresentedClaimantDateOfBirthController();
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.userCase).toMatchObject({
        representedClaimantDateOfBirth: {
          day: '05',
          month: '11',
          year: '2000',
        },
      });
    });

    it('should redirect to represented claimant sex and title when correct date is entered', async () => {
      const request = mockRequest({
        body: {
          'representedClaimantDateOfBirth-day': '05',
          'representedClaimantDateOfBirth-month': '11',
          'representedClaimantDateOfBirth-year': '2000',
        },
      });
      const response = mockResponse();

      await new RepresentedClaimantDateOfBirthController().post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_SEX_AND_TITLE);
    });
  });
});
