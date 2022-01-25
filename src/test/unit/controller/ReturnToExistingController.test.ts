import ReturnToExistingController from "../../../main/controllers/return_to_existing_claim/ReturnToExistingController";
import { AppRequest } from "../../../main/definitions/appRequest";
import { FormContent } from "../../../main/definitions/form";
import sinon from "sinon";
import { returnToExistingMockRequest } from "../mocks/mockRequest";
import { mockResponse } from "../mocks/mockResponse";
import { isFieldFilledIn } from "../../../main/components/form/validator";

describe("Return To Existing Controller", () => {

  const t = {
    'return-to-claim': {},
    common: {},
  };
  const mockedFormContent = {
    fields: {
      returnToExisting: {
        id: 'return_number_or_account',
        type: 'radios',
        classes: 'govuk-date-input',
        label: "select",
        labelHidden: true,
        values: [
          {
            name: 'have_return_number',
            label: "I have a return number",
            selected: false,
            value: "Yes",
          },
          {
            name: 'have_account',
            label: "I have an account",
            selected: false,
            value: "Yes",
          },
        ],
        validator: isFieldFilledIn,
      },      
    }
  } as unknown as FormContent;

  it('should render the return to claim page', () => {
    const controller = new ReturnToExistingController(mockedFormContent);
    const response = mockResponse();
    const request = <AppRequest>returnToExistingMockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('return-to-claim');

    controller.get(request, response);

    responseMock.verify();


  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'returnToExisting', errorType: 'required' }];
    const body = { 'returnToExisting': '' };

    const controller = new ReturnToExistingController(mockedFormContent);

    const req = returnToExistingMockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);    
  });


  it('should redirect to home if no errors', () => {    
    const body = { 'returnToExisting': 'Yes' };

    const controller = new ReturnToExistingController(mockedFormContent);

    const req = returnToExistingMockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toBeCalledWith('/');
    expect(req.session.errors).toEqual([]);    
  });

});
