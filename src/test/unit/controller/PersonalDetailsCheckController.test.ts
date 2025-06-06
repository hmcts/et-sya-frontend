import PersonalDetailsCheckController from '../../../main/controllers/PersonalDetailsCheckController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Test task List check controller', () => {
  const t = {
    personalDetailsCheck: {},
    common: {},
  };

  it('should render the task list check page', () => {
    const controller = new PersonalDetailsCheckController();

    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });

  it('should render the claim steps page', async () => {
    const body = { personalDetailsCheck: YesOrNo.YES };
    const userCase: Partial<CaseWithId> = {
      typeOfClaim: ['Unfair Dismissal'],
      address1: '123 Main Street',
      addressTown: 'London',
      addressPostcode: 'SW1A 1AA',
      addressCountry: 'UK',
    };
    const controller = new PersonalDetailsCheckController();
    const req = mockRequest({ body, userCase });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });

  it('should render same page if nothing selected', async () => {
    const errors = [{ propertyName: 'personalDetailsCheck', errorType: 'required' }];
    const body = { personalDetailsCheck: '' };
    const controller = new PersonalDetailsCheckController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should render the task list check page with errors when userCase is invalid', async () => {
    const body = { personalDetailsCheck: YesOrNo.YES };
    const userCase = {}; // Invalid userCase
    const errors = [{ propertyName: 'personalDetailsCheck', errorType: 'invalid' }];
    const controller = new PersonalDetailsCheckController();

    const req = mockRequest({ body, userCase });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.errors).toEqual(errors);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.TASK_LIST_CHECK, expect.anything());
  });
});
