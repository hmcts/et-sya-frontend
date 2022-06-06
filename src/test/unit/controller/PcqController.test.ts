import axios from 'axios';
import config from 'config';

import PcqController from '../../../main/controllers/PcqController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
jest.mock('config');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedConfig = config as jest.Mocked<typeof config>;

describe('PCQGetController', () => {
  const controller = new PcqController();

  test('Should redirect to PCQ if PCQ status is up', async () => {
    // mockedConfig.get.mockReturnValueOnce('true');
    mockedConfig.get.mockReturnValueOnce('https://pcq.aat.platform.hmcts.net/health');
    mockedConfig.get.mockReturnValueOnce('https://pcq.aat.platform.hmcts.net/service-endpoint');
    mockedConfig.get.mockReturnValueOnce('SAjhk11Ykyvs45Xvybwz2qmUe3C3bCl45bYPgsBu3Titb3Ejd0W9N03cU6rNNtP');

    const req = mockRequest({});
    const res = mockResponse();
    req.protocol = 'http';
    req.headers = {
      host: 'localhost:3001',
    };
    const redirectMock = jest.fn();
    res.redirect = redirectMock;

    mockedAxios.get.mockResolvedValue({
      data: {
        status: 'UP',
      },
    });

    await controller.get(req, res);
    expect(redirectMock.mock.calls[0]).toContain('/service-endpoint');
  });

  test('Should redirect to Check Your Answers if PCQ Health is DOWN', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    mockedAxios.get.mockResolvedValue(
      Promise.resolve({
        data: {
          status: 'DOWN',
        },
      })
    );

    await controller.get(req, res);

    expect(res.redirect).toBeCalledWith('/check-your-answers');
  });

  test('Should redirect to Check Your Answers if config cannot be loaded', async () => {
    mockedConfig.get.mockReturnValueOnce(undefined);
    mockedConfig.get.mockReturnValueOnce(undefined);

    const req = mockRequest({});
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.redirect).toBeCalledWith(PageUrls.CHECK_ANSWERS);
  });
});
