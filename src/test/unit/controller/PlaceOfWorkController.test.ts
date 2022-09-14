import axios from 'axios';

import PlaceOfWorkController from '../../../main/controllers/PlaceOfWorkController';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

describe('Place Of Work Controller Tests', () => {
  const t = {
    'place-of-work': {},
    'enter-address': {},
    common: {},
  };

  it('should render place of work page', () => {
    const controller = new PlaceOfWorkController(mockLogger);
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('place-of-work', expect.anything());
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'workAddress1', errorType: 'required' }];
    const body = {
      workAddress1: '',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to Acas number page if no errors', () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/respondent/1/acas-cert-num');
    expect(req.session.errors).toEqual([]);
  });
  it('should redirect to your claim has been saved page when save as draft selected and nothing is entered', () => {
    const body = { saveForLater: true };
    const controller = new PlaceOfWorkController(mockLogger);

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should add place of work to the session userCase', () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress2: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController(mockLogger);
    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(req.session.userCase.respondents[0].workAddress1).toStrictEqual('31 The Street');
    expect(req.session.userCase.respondents[0].workAddress2).toStrictEqual('');
    expect(req.session.userCase.respondents[0].workAddressTown).toStrictEqual('Exeter');
    expect(req.session.userCase.respondents[0].workAddressCountry).toStrictEqual('United Kingdom');
    expect(req.session.userCase.respondents[0].workAddressPostcode).toStrictEqual('EX7 8KK');

    expect(req.session.userCase.respondents[0].respondentNumber).toStrictEqual(1);
  });

  it('should run logger in catch block', async () => {
    const body = {
      workAddress1: '31 The Street',
      workAddress12: '',
      workAddressTown: 'Exeter',
      workAddressCountry: 'United Kingdom',
      workAddressPostcode: 'EX7 8KK',
    };
    const controller = new PlaceOfWorkController(mockLogger);
    const request = mockRequest({ body });
    const response = mockResponse();

    await controller.post(request, response);

    return caseApi.updateDraftCase(request.session.userCase).then(() => expect(mockLogger.error).toHaveBeenCalled());
  });
});
