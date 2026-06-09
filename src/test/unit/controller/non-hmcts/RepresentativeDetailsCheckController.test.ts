import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentativeDetailsCheckController from '../../../../main/controllers/non-hmcts/RepresentativeDetailsCheckController';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('RepresentativeDetailsCheckController', () => {
  const t = {
    'non-hmcts/representative-details-check': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the task list check page', () => {
      const controller = new RepresentativeDetailsCheckController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIM_STEPS_NON_HMCTS when No is selected', async () => {
      const body = { representativeDetailsCheck: YesOrNo.NO };
      const controller = new RepresentativeDetailsCheckController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
    });

    it('should render same page with required error when nothing is selected', async () => {
      const errors = [{ propertyName: 'representativeDetailsCheck', errorType: 'required' }];
      const body = { representativeDetailsCheck: '' };
      const controller = new RepresentativeDetailsCheckController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should redirect to CLAIM_STEPS_NON_HMCTS when Yes is selected and mandatory fields are present', async () => {
      const body = { representativeDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representativeName: 'Jane Smith',
        repAddress1: '10 Legal Street',
      };
      const controller = new RepresentativeDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS_NON_HMCTS);
    });

    it('should render task list check page with invalid error when Yes is selected but representativeName is missing', async () => {
      const body = { representativeDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        repAddress1: '10 Legal Street',
      };
      const errors = [{ propertyName: 'representativeDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentativeDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but repAddress1 is missing', async () => {
      const body = { representativeDetailsCheck: YesOrNo.YES };
      const userCase: Partial<CaseWithId> = {
        representativeName: 'Jane Smith',
      };
      const errors = [{ propertyName: 'representativeDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentativeDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });

    it('should render task list check page with invalid error when Yes is selected but both mandatory fields are missing', async () => {
      const body = { representativeDetailsCheck: YesOrNo.YES };
      const userCase = {};
      const errors = [{ propertyName: 'representativeDetailsCheck', errorType: 'invalid' }];
      const controller = new RepresentativeDetailsCheckController();
      const req = mockRequest({ body, userCase });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.errors).toEqual(errors);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
    });
  });
});
