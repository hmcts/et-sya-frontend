import LipOrRepController from '../../../main/controllers/LipOrRepController';
import { YesOrNo, claimantRepresented } from '../../../main/definitions/case';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Litigation in Person or Representative Controller', () => {
  const t = {
    claimantRepresentedQuestion: {},
    common: {},
  };

  it("should render the 'representing myself (LiP) or using a representative choice' page", () => {
    const controller = new LipOrRepController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('lip-or-representative', expect.anything());
  });

  it("should render the Single or Multiple claims page when (No) 'representing myself' is selected", () => {
    const body = { claimantRepresentedQuestion: YesOrNo.NO };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/single-or-multiple-claim');
  });

  it("should render the legacy ET1 service when - yes - they are 'making a claim for someone else' option is selected", () => {
    const body = { claimantRepresentedQuestion: YesOrNo.YES };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number');
  });

  it("should render the 'Making a claim as a legal representative' page - they are 'a legal representative making a single claim' option is selected", () => {
    const body = { claimantRepresentedQuestion: claimantRepresented.LEGAL_REP_SINGLE_CLAIM };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/making-claim-as-legal-representative');
  });

  it("should render the legacy ET1 service when - they are 'a legal representative making a group claim' option is selected", () => {
    const body = { claimantRepresentedQuestion: claimantRepresented.LEGAL_REP_GROUP_CLAIM };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number');
  });

  it('should render same page if errors are present when nothing is selected', () => {
    const errors = [{ propertyName: 'claimantRepresentedQuestion', errorType: 'required' }];
    const body = { claimantRepresentedQuestion: '' };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
