import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantDetailsCheckController from '../../../../main/controllers/represented-claimant/RepresentedClaimantDetailsCheckController';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Represented Claimant Details Check Controller', () => {
  const t = {
    'represented-claimant-details-check': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the task list check page', () => {
      const controller = new RepresentedClaimantDetailsCheckController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIM_STEPS_NON_HMCTS when No is selected', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.NO };
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
    });

    it('should render same page with required error when nothing is selected', async () => {
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'required' }];
      const body = { representedClaimantDetailsCheck: '' };
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to CLAIM_STEPS_NON_HMCTS when Yes is selected and mandatory fields are present', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantFirstName: 'Jane',
        representedClaimantLastName: 'Doe',
        representedClaimantAddress1: '10 Claimant Street',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantEmail: 'jane.doe@example.com',
      };
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantAddress1 is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase = {
        representedClaimantFirstName: 'Jane',
        representedClaimantLastName: 'Doe',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantEmail: 'jane.doe@example.com',
      };
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantAddressTown is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantFirstName: 'Jane',
        representedClaimantLastName: 'Doe',
        representedClaimantAddress1: '10 Claimant Street',
        representedClaimantAddressCountry: 'England',
        representedClaimantEmail: 'jane.doe@example.com',
      };
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantAddressCountry is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantFirstName: 'Jane',
        representedClaimantLastName: 'Doe',
        representedClaimantAddress1: '10 Claimant Street',
        representedClaimantAddressTown: 'London',
        representedClaimantEmail: 'jane.doe@example.com',
      };
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantFirstName is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantLastName: 'Doe',
        representedClaimantAddress1: '10 Claimant Street',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantEmail: 'jane.doe@example.com',
      };
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantLastName is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantFirstName: 'Jane',
        representedClaimantAddress1: '10 Claimant Street',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
        representedClaimantEmail: 'jane.doe@example.com',
      };
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but representedClaimantEmail is missing', async () => {
      const body = { representedClaimantDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representedClaimantFirstName: 'Jane',
        representedClaimantLastName: 'Doe',
        representedClaimantAddress1: '10 Claimant Street',
        representedClaimantAddressTown: 'London',
        representedClaimantAddressCountry: 'England',
      };
      const errors = [{ propertyName: 'representedClaimantDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentedClaimantDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });
  });
});
