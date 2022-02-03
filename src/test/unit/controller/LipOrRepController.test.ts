import sinon from 'sinon';
import LipOrRepController from '../../../main/controllers/litigation_in_person_or_representative/lipOrRepController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { LEGACY_URLS } from '../../../main/definitions/constants';
import { FormContent } from '../../../main/definitions/form';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { YesOrNo } from 'definitions/case';

describe('Litigation in Person or Representative Controller', () => {
  const t = {
    'representingMyself': {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      representingMyself: {
        type: 'radios',
        values: [
          {
            value: YesOrNo.YES, 
          },
          {
            value: YesOrNo.NO, 
          },
        ],
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
    },
    submit: {
      text: 'continue',
    },
  } as unknown as FormContent;



  it('should render the \'representing myself (LiP) or using a representative choice\' page', () => {

    const lipOrRepController = new LipOrRepController(mockFormContent);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('lip-or-representative');

    lipOrRepController.get(request, response);
    responseMock.verify();
  });

  it('should render the Single or Multiple claims page when \'representing myself\' is selected', () => {

    const body = { representingMyself: YesOrNo.YES };
    const controller = new LipOrRepController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/single-or-multiple-claim');

  });

  it('should render the legacy ET1 service when the \'making a claim for someone else\' option is selected', () => {
    const body = { representingMyself: YesOrNo.NO };
    const controller = new LipOrRepController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(LEGACY_URLS.ET1);
  });

  it('should render same page if errors are present when nothing is selected', () => {
    const errors = [{ propertyName: 'representingMyself', errorType: 'required' }];
    const body = { representingMyself: '' };
    const controller = new LipOrRepController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

});
