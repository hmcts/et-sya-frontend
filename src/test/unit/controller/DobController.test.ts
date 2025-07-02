import DobController from '../../../main/controllers/DobController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('Dob Controller', () => {
  const t = {
    'date-of-birth': {},
    common: {},
  };

  it('should render the DobController page', () => {
    const dobController = new DobController();

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
      state: 'AWAITING_SUBMISSION_TO_HMCTS',
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
      new DobController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
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
      new DobController().post(req, mockResponse());

      expect(req.session.errors).toEqual(errors);
    });

    it('should update draft case when date is submitted', async () => {
      const body = {
        'dobDate-day': '05',
        'dobDate-month': '11',
        'dobDate-year': '2000',
      };
      const req = mockRequestEmpty({ body });
      const controller = new DobController();
      const res = mockResponse();
      await controller.post(req, res);

      expect(req.session.userCase).toMatchObject({
        dobDate: {
          day: '05',
          month: '11',
          year: '2000',
        },
      });
    });

    it('should go to the Sex and Title page when correct date is entered', async () => {
      const req = mockRequest({
        body: {
          'dobDate-day': '05',
          'dobDate-month': '11',
          'dobDate-year': '2000',
        },
      });
      const res = mockResponse();
      await new DobController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SEX_AND_TITLE);
    });
  });
});
