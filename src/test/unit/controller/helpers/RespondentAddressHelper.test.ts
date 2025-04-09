import { Form } from '../../../../main/components/form/form';
import { RespondentAddressHelper } from '../../../../main/controllers/helpers/RespondentAddressHelper';
import { FormContent } from '../../../../main/definitions/form';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';
import { userCaseWithRespondent } from '../../mocks/mockUserCaseWithRespondent';
interface Params {
  respondentNumber: string;
}

it('should handle POST request and redirect to the correct URL', async () => {
  const form = new Form({});
  const nextPage = '/respondent-address-manual';
  const body = {
    respondentAddress1: '15 test street',
    respondentAddressTown: 'test',
    respondentAddressPostcode: 'AB1 2CD',
    respondentAddressCountry: 'Test Country',
  };

  const request = mockRequest({
    body,
    session: {
      params: { respondentNumber: '1' } as Params,
      userCase: userCaseWithRespondent,
    },
  });

  const res = mockResponse();
  await RespondentAddressHelper.handlePost(request, res, form, nextPage);

  expect(res.redirect).toHaveBeenCalledWith('/respondent/1/respondent-address-manual');
});

it('should handle GET request and render the correct page with respondent details', () => {
  const req = mockRequest({
    session: {
      userCase: {
        respondents: [
          { respondentNumber: '1', respondentName: 'Test Respondent', respondentAddressPostcode: 'AB1 2CD' },
        ],
        respondentAddressTypes: {},
      },
    },
  });
  const res = mockResponse();
  const form = new Form({});
  const content = {} as FormContent;
  const translationKeys = ['common', 'respondentAddressManual'];

  RespondentAddressHelper.handleGet(req, res, form, content, translationKeys);

  expect(res.render).toHaveBeenCalledWith(
    'respondentAddressManual',
    expect.objectContaining({
      respondentName: 'Test Respondent',
      previousPostcode: 'AB1 2CD',
    })
  );
});

it('should handle GET request and fill respondent address fields if respondentAddressTypes is defined', () => {
  const req = mockRequest({
    session: {
      userCase: {
        respondents: [
          { respondentNumber: '1', respondentName: 'Test Respondent', respondentAddressPostcode: 'AB1 2CD' },
        ],
        respondentAddressTypes: { address1: '10 Test Street' },
      },
    },
  });
  const res = mockResponse();
  const form = new Form({});
  const content = {} as FormContent;
  const translationKeys = ['common', 'respondentAddressManual'];

  RespondentAddressHelper.handleGet(req, res, form, content, translationKeys);

  expect(res.render).toHaveBeenCalledWith(
    'respondentAddressManual',
    expect.objectContaining({
      respondentName: 'Test Respondent',
      previousPostcode: 'AB1 2CD',
    })
  );
});
