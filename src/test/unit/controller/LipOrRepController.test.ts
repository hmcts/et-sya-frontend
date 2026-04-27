import LipOrRepController from '../../../main/controllers/LipOrRepController';
import { claimantRepresented } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Litigation in Person or Representative Controller', () => {
  const t = {
    question: {
      legend: 'legend',
      radio1: 'radio1',
      radio2: 'radio2',
      radio3: 'radio3',
    },
    common: {
      continue: 'Continue',
    },
  };

  it("should render the 'representing myself (LiP) or using a representative choice' page", () => {
    const controller = new LipOrRepController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('lip-or-representative', expect.anything());
  });

  it("should redirect to Jurisdiction Selection when 'CLAIMING_FOR_MYSELF' is selected", () => {
    const body = { claimantRepresentedQuestion: claimantRepresented.CLAIMING_FOR_MYSELF };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    // Matching the controller logic: CLAIM_JURISDICTION_SELECTION
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_JURISDICTION_SELECTION);
  });

  it("should redirect to Jurisdiction Selection when 'CLAIMING_FOR_SOMEONE_ELSE' is selected", () => {
    const body = { claimantRepresentedQuestion: claimantRepresented.CLAIMING_FOR_SOMEONE_ELSE };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_JURISDICTION_SELECTION);
  });

  it("should redirect to 'Making a claim as a legal representative' when 'LEGAL_REP' is selected", () => {
    const body = { claimantRepresentedQuestion: claimantRepresented.LEGAL_REP };
    const controller = new LipOrRepController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE);
  });

  it('should render same page (redirect to self) if errors are present when nothing is selected', () => {
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
