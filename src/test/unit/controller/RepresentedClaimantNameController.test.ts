import RepresentedClaimantNameController from '../../../main/controllers/represented-claimant/RepresentedClaimantNameController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/controllers/helpers/CaseHelpers', () => ({
  ...jest.requireActual('../../../main/controllers/helpers/CaseHelpers'),
  handleUpdateDraftCase: jest.fn(() => Promise.resolve()),
}));

describe('RepresentedClaimantNameController', () => {
  const t = {
    'represented-claimant-name': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the represented claimant name page', () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.REPRESENTED_CLAIMANT_NAME, expect.anything());
    });

    it('should NOT populate the name fields from the seeded claimant record on a normal visit', () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { representedClaimantFirstName: 'Jane', representedClaimantLastName: 'Doe' },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.userCase.representedClaimantFirstName).toBeUndefined();
      expect(renderArgs.userCase.representedClaimantLastName).toBeUndefined();
    });

    it('should not mutate the stored case when stripping the seeded name values', () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { representedClaimantFirstName: 'Jane', representedClaimantLastName: 'Doe' },
      });

      controller.get(request, response);

      expect(request.session.userCase.representedClaimantFirstName).toBe('Jane');
      expect(request.session.userCase.representedClaimantLastName).toBe('Doe');
    });

    it('should populate the name fields once they have been explicitly provided', () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          representedClaimantFirstName: 'Jane',
          representedClaimantLastName: 'Doe',
          representedClaimantNameProvided: YesOrNo.YES,
        },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.userCase.representedClaimantFirstName).toBe('Jane');
      expect(renderArgs.userCase.representedClaimantLastName).toBe('Doe');
    });
  });

  describe('post()', () => {
    it('should redirect to represented claimant date of birth when name is given', async () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = { representedClaimantFirstName: 'Jane', representedClaimantLastName: 'Doe' };

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REPRESENTED_CLAIMANT_DATE_OF_BIRTH);
    });

    it('should flag the name as provided when a value is submitted', async () => {
      const controller = new RepresentedClaimantNameController();
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = { representedClaimantFirstName: 'Jane', representedClaimantLastName: 'Doe' };

      await controller.post(request, response);

      expect(request.session.userCase.representedClaimantNameProvided).toEqual(YesOrNo.YES);
    });

    it('should flag the name as not provided when submitted blank', async () => {
      const body = { representedClaimantFirstName: '', representedClaimantLastName: '' };
      const controller = new RepresentedClaimantNameController();
      const request = mockRequestEmpty({ body });
      const response = mockResponse();

      await controller.post(request, response);

      expect(request.session.userCase.representedClaimantNameProvided).toEqual(YesOrNo.NO);
    });

    it('should stay on page and error when name is empty', async () => {
      const body = { representedClaimantFirstName: '', representedClaimantLastName: '' };
      const controller = new RepresentedClaimantNameController();
      const request = mockRequestEmpty({ body });
      const response = mockResponse();

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(
        request.session.errors.some((e: { propertyName: string }) => e.propertyName === 'representedClaimantFirstName')
      ).toBe(true);
      expect(
        request.session.errors.some((e: { propertyName: string }) => e.propertyName === 'representedClaimantLastName')
      ).toBe(true);
    });
  });
});
