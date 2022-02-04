import sinon from 'sinon';
import VideoHearingsController from '../../../main/controllers/video_hearings/VideoHearingsController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { FormContent } from '../../../main/definitions/form';
import { isFieldFilledIn } from '../../../main/components/form/validator';
import { YesOrNo } from 'definitions/case';

describe('Video Hearing Controller', () => {
  const t = {
    'video-hearings': {},
    common: {},
  };

  const mockFormContent: FormContent = {
    fields: {
      videoHearings: {
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

  it('should render the video hearings choice page', () => {
    const controller = new VideoHearingsController(mockFormContent);
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });
    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('video-hearings');

    controller.get(request, response);
    responseMock.verify();
  });

  it('should render same page if errors are present', () => {
    const errors = [{ propertyName: 'videoHearings', errorType: 'required' }];
    const body = { videoHearings: '' };
    const controller = new VideoHearingsController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the videoHearings form value to the userCase', () => {
    const body = { 'videoHearings': YesOrNo.NO };

    const controller = new VideoHearingsController(mockFormContent);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.session.userCase = undefined;

    controller.post(req, res);

    expect(res.redirect).toBeCalledWith('/steps-to-making-your-claim');
    expect(req.session.userCase).toStrictEqual({videoHearings: YesOrNo.NO});
  });
});
