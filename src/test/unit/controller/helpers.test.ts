import {
  getCustomNoticeLengthError,
  getNewJobPartialPayInfoError,
  getPartialPayInfoError,
  getSectionStatus,
  setUserCaseWithRedisData,
} from '../../../main/controllers/helpers';
import { PayInterval, StillWorking, YesOrNo } from '../../../main/definitions/case';
import { sectionStatus } from '../../../main/definitions/definition';
import { mockSession } from '../mocks/mockApp';
import { mockRequest } from '../mocks/mockRequest';

describe('Partial Pay errors', () => {
  it('should return error if pay interval does not exist', () => {
    const formData = { payBeforeTax: 123, payAfterTax: 123 };
    const expectedErrors = [{ errorType: 'required', propertyName: 'payInterval' }];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return error if pay before and after tax does not exist', () => {
    const formData = { payInterval: PayInterval.WEEKLY };
    const expectedErrors = [
      { errorType: 'required', propertyName: 'payBeforeTax' },
      { errorType: 'required', propertyName: 'payAfterTax' },
    ];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return pay interval error if only pay before tax is entered', () => {
    const formData = { payBeforeTax: 56 };
    const expectedErrors = [{ errorType: 'payBeforeTax', propertyName: 'payInterval' }];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return pay interval error if only pay after tax is entered', () => {
    const formData = { payAfterTax: 56 };
    const expectedErrors = [{ errorType: 'payAfterTax', propertyName: 'payInterval' }];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return pay interval error if only pay before and after tax is entered', () => {
    const formData = { payBeforeTax: 56, payAfterTax: 56 };
    const expectedErrors = [{ errorType: 'required', propertyName: 'payInterval' }];
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return no errors when both pay interval and pay before tax exist', () => {
    const formData = { payBeforeTax: 123, payInterval: PayInterval.WEEKLY };
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(undefined);
  });

  it('should return no errors when both pay interval and pay after tax exist', () => {
    const formData = { payAfterTax: 123, payInterval: PayInterval.WEEKLY };
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(undefined);
  });

  it('should return no errors when both new job pay interval and new job pay exist', () => {
    const formData = { newJobPay: 123, newJobPayInterval: PayInterval.WEEKLY };
    const errors = getPartialPayInfoError(formData);

    expect(errors).toEqual(undefined);
  });
});

describe('New Job Partial Pay errors', () => {
  it('should return error if new job pay interval does not exist', () => {
    const formData = { newJobPay: 123 };
    const expectedErrors = [{ errorType: 'required', propertyName: 'newJobPayInterval' }];
    const errors = getNewJobPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return error if new job pay does not exist', () => {
    const formData = { newJobPayInterval: PayInterval.WEEKLY };
    const expectedErrors = [{ errorType: 'required', propertyName: 'newJobPay' }];
    const errors = getNewJobPartialPayInfoError(formData);

    expect(errors).toEqual(expectedErrors);
  });
});

describe('Custom Notice Length errors', () => {
  it('should return no error', () => {
    const body = {
      employmentStatus: StillWorking.NOTICE,
    };
    const formData = { noticePeriodLength: '12' };

    const req = mockRequest({ body });
    const errors = getCustomNoticeLengthError(req, formData);

    expect(errors).toEqual(undefined);
  });

  it('should return error with empty notice period length', () => {
    const body = {
      employmentStatus: StillWorking.NOTICE,
    };
    const formData = { noticePeriodLength: '' };

    const req = mockRequest({ body });
    const expectedErrors = { errorType: 'invalid', propertyName: 'noticePeriodLength' };
    const errors = getCustomNoticeLengthError(req, formData);

    expect(errors).toEqual(expectedErrors);
  });

  it('should return error when invalid number is entered', () => {
    const body = {
      employmentStatus: StillWorking.NOTICE,
    };
    const formData = { noticePeriodLength: 'ab' };

    const req = mockRequest({ body });
    const expectedErrors = { errorType: 'notANumber', propertyName: 'noticePeriodLength' };
    const errors = getCustomNoticeLengthError(req, formData);

    expect(errors).toEqual(expectedErrors);
  });

  it(
    'should set req.session.userCase when setUserCaaseWithRedisData is called with correspondent' +
      'req, and caseData parameters',
    () => {
      const req = mockRequest({ session: mockSession([], [], []) });
      const caseData =
        '[["claimantRepresentedQuestion",null],["caseType",null],["typesOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"id":"testUserCaseId","state":"Draft","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"],"tellUsWhatYouWant":[],"claimantRepresentedQuestion":"No","caseType":"Multiple"}'
      );
    }
  );
});

describe('getSectionStatus()', () => {
  it.each([
    {
      detailsCheckValue: YesOrNo.YES,
      sessionValue: undefined,
      expected: sectionStatus.completed,
    },
    {
      detailsCheckValue: YesOrNo.NO,
      sessionValue: undefined,
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: undefined,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 'a string',
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 0,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 1,
      expected: sectionStatus.inProgress,
    },
  ])('checks section status for task list page when %o', ({ detailsCheckValue, sessionValue, expected }) => {
    const providedStatus = getSectionStatus(detailsCheckValue, sessionValue);
    expect(providedStatus).toStrictEqual(expected);
  });
});
