import { AxiosResponse } from 'axios';
import { LoggerInstance } from 'winston';

import DobController from '../../../main/controllers/DobController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { PageUrls } from '../../../main/definitions/constants';
import * as caseApi from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Dob Controller', () => {
  const t = {
    'date-of-birth': {},
    common: {},
  };

  const getCaseApiMock = jest.spyOn(caseApi, 'getCaseApi');

  const mockLogger = {
    error: jest.fn().mockImplementation((message: string) => message),
    info: jest.fn().mockImplementation((message: string) => message),
  } as unknown as LoggerInstance;

  it('should render the DobController page', () => {
    const dobController = new DobController(mockLogger);

    const response = mockResponse();
    const request = mockRequest({ t });

    dobController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('date-of-birth', expect.anything());
    expect(request.session.userCase).toEqual({
      dobDate: {
        day: '24',
        month: '12',
        year: '2000',
      },
      startDate: {
        day: '21',
        month: '04',
        year: '2019',
      },
      id: '1234',
    });
  });

  describe('Correct validation', () => {
    it('should redirect to the same screen when errors are present', () => {
      const req = mockRequest({
        body: {
          'dobDate-day': 'a',
        },
      });
      const res = mockResponse();
      new DobController(mockLogger).post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
    });

    // No input and one per validator
    it.each([
      { body: { 'dobDate-day': '', 'dobDate-month': '', 'dobDate-year': '' }, errors: [] },
      {
        body: { 'dobDate-day': '05', 'dobDate-month': '11', 'dobDate-year': '' },
        errors: [{ errorType: 'yearRequired', fieldName: 'year', propertyName: 'dobDate' }],
      },
      {
        body: { 'dobDate-day': '05', 'dobDate-month': '13', 'dobDate-year': '2000' },
        errors: [{ errorType: 'monthInvalid', fieldName: 'month', propertyName: 'dobDate' }],
      },
      {
        body: { 'dobDate-day': '05', 'dobDate-month': '11', 'dobDate-year': `${new Date().getFullYear() + 1}` },
        errors: [{ errorType: 'invalidDateInFuture', fieldName: 'day', propertyName: 'dobDate' }],
      },
      {
        body: { 'dobDate-day': '05', 'dobDate-month': '11', 'dobDate-year': `${new Date().getFullYear() - 1}` },
        errors: [{ errorType: 'invalidDateTooRecent', fieldName: 'day', propertyName: 'dobDate' }],
      },
    ])('should return appropriate errors for %o', ({ body, errors }) => {
      const req = mockRequest({ body });
      new DobController(mockLogger).post(req, mockResponse());

      expect(req.session.errors).toEqual(errors);
    });

    it('should update draft case when date is submitted', () => {
      const request = mockRequest({
        body: {
          'dobDate-day': '05',
          'dobDate-month': '11',
          'dobDate-year': '2000',
        },
      });
      new DobController(mockLogger).post(request, mockResponse());

      expect(request.session.userCase).toMatchObject({
        dobDate: {
          day: '05',
          month: '11',
          year: '2000',
        },
      });
    });

    it('should go to the Gender details page when correct date is entered', () => {
      const req = mockRequest({
        body: {
          'dobDate-day': '05',
          'dobDate-month': '11',
          'dobDate-year': '2000',
        },
      });
      const res = mockResponse();
      new DobController(mockLogger).post(req, res);

      expect(res.redirect).toBeCalledWith(PageUrls.GENDER_DETAILS);
    });
  });

  it('should invoke logger in then() block', async () => {
    (getCaseApiMock as jest.Mock).mockReturnValue({
      updateDraftCase: jest.fn(() => {
        return Promise.resolve({} as AxiosResponse<CaseApiDataResponse>);
      }),
    });

    await new DobController(mockLogger).post(
      mockRequest({
        body: {
          'dobDate-day': '12',
          'dobDate-month': '12',
          'dobDate-year': '2005',
        },
      }),
      mockResponse()
    );

    expect(mockLogger.info).toBeCalled();
  });
});
