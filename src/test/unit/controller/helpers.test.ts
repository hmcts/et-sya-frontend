import {
  getACASCertificateNumberError,
  getClaimSummaryError,
  getCustomNoticeLengthError,
  getNewJobPartialPayInfoError,
  getPartialPayInfoError,
  getSectionStatus,
  handleSessionErrors,
  isPostcodeMVPLocation,
  setUserCaseForRespondent,
  setUserCaseWithRedisData,
} from '../../../main/controllers/helpers';
import { PayInterval, StillWorking, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { sectionStatus } from '../../../main/definitions/definition';
import { mockSession } from '../mocks/mockApp';
import {
  mockForm,
  mockFormField,
  mockValidationCheckWithOutError,
  mockValidationCheckWithRequiredError,
} from '../mocks/mockForm';
import { mockRequest, mockRequestWithSaveException } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { userCaseWith4Respondents } from '../mocks/mockUserCaseWithRespondent';

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
});

describe('Claim Summary Error', () => {
  it('should not return any errors when not on the summary page', () => {
    const body = {};

    const errors = getClaimSummaryError(body);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if only text has been provided', () => {
    const body = { claimSummaryText: 'text' };

    const errors = getClaimSummaryError(body);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if only a file has been provided', () => {
    const body = { claimSummaryFile: 'file' };

    const errors = getClaimSummaryError(body);

    expect(errors).toEqual(undefined);
  });

  it('should return required error if neither text nor file has been provided', () => {
    const body = {
      claimSummaryText: '',
      claimSummaryFile: '',
    };

    const errors = getClaimSummaryError(body);

    expect(errors).toEqual({ propertyName: 'claimSummaryText', errorType: 'required' });
  });

  it('should return textAndFile error if neither text nor file has been provided', () => {
    const body = {
      claimSummaryText: 'text',
      claimSummaryFile: 'file',
    };

    const errors = getClaimSummaryError(body);

    expect(errors).toEqual({ propertyName: 'claimSummaryText', errorType: 'textAndFile' });
  });
});

describe('ACAS Certificate Number Errors', () => {
  it('should not return an error if correct acas number provided', () => {
    const body = { acasCertNum: 'R1234/5678/12' };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if correct acasCert is No', () => {
    const body = {
      acasCertNum: 'R1234/5678/12',
      acasCert: YesOrNo.NO,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual(undefined);
  });

  it('should return an error if acas number not provided', () => {
    const body = {
      acasCertNum: '',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'required', propertyName: 'acasCertNum' });
  });

  it('should return an error if invalid acas number provided - (//)', () => {
    const body = {
      acasCertNum: 'R1234//678/12',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'invalidAcasNumber', propertyName: 'acasCertNum' });
  });

  it('should return an error if invalid acas number provided - (Not starts with R)', () => {
    const body = {
      acasCertNum: '1234//678/12',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'invalidAcasNumber', propertyName: 'acasCertNum' });
  });

  it('should return an error if invalid acas number provided - (ends with /)', () => {
    const body = {
      acasCertNum: '1234/678/12/',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'invalidAcasNumber', propertyName: 'acasCertNum' });
  });

  it('should return an error if invalid acas number provided - (less than 11 character)', () => {
    const body = {
      acasCertNum: 'R1234/6781',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'invalidAcasNumber', propertyName: 'acasCertNum' });
  });

  it('should return an error if invalid acas number provided - (more than 13 character)', () => {
    const body = {
      acasCertNum: 'R1234/67891234',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'invalidAcasNumber', propertyName: 'acasCertNum' });
  });

  it('should return an error if invalid acas number provided - (has character which is not numeric and / after R)', () => {
    const body = {
      acasCertNum: 'R1234/6c91234',
      acasCert: YesOrNo.YES,
    };

    const errors = getACASCertificateNumberError(body);

    expect(errors).toEqual({ errorType: 'invalidAcasNumber', propertyName: 'acasCertNum' });
  });
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

describe('isPostcodeMVPLocation()', () => {
  it.each([
    { postcode: 'G22 6LZ', expected: true }, // Glasgow
    { postcode: 'G32 7RH', expected: true }, // Glasgow
    { postcode: 'G20 9TA', expected: true }, // Glasgow
    { postcode: 'LS9 8FF', expected: true }, // Leeds
    { postcode: 'LS146AD', expected: true }, // Leeds
    { postcode: 'LS124AT', expected: true }, // Leeds
    { postcode: 'EH12 9FZ', expected: true }, // Edinburgh
    { postcode: 'EH12 8XL', expected: true },
    { postcode: 'TD1 1AA', expected: true },
    { postcode: 'TD1 1AB', expected: true },
    { postcode: 'TD1 1AD', expected: true },
    { postcode: 'TD14 5AA', expected: true },
    { postcode: 'ZE1 0AA', expected: true }, //  Lerwick
    { postcode: 'AB1 0AA', expected: true }, // Aberdeen
    { postcode: 'ML1 1AJ', expected: true }, // Motherwell
    { postcode: 'HS1 2AA', expected: true }, // Outer Hebrides
    { postcode: 'HS5 3TT', expected: true },
    { postcode: 'KA1 1AA', expected: true }, // Kilmarnock
    { postcode: 'IV32 7HN', expected: true }, // Inverness
    { postcode: 'OL14 5AA', expected: true }, // Oldham
    { postcode: '1', expected: false },
    { postcode: '2', expected: false },
    { postcode: '100', expected: false },
    { postcode: '', expected: false },
    { postcode: 'TD15 1AA', expected: false },
    { postcode: 'ISE2 0YN', expected: false }, // London
    { postcode: 'W6 9AW', expected: false },
    { postcode: 'SE12 0LJ', expected: false },
    { postcode: 'E4 7AJ', expected: false },
    { postcode: 'E15 1FE', expected: false },
    { postcode: 'N16 6PH', expected: false },
    { postcode: 'E2 6GU', expected: false },
    { postcode: 'W3 7NX', expected: false },
    { postcode: 'E8 1LW', expected: false },
    { postcode: 'E2 6NR', expected: false },
    { postcode: 'LU7 0EU', expected: false }, // Luton
    { postcode: 'LE3 1EP', expected: false }, // Leicester
    { postcode: 'M41 8PX', expected: false }, // Manchester
    { postcode: 'NE289QH', expected: false }, // Newcastle
    { postcode: 'LE3 1EP', expected: false }, // Leicester
    { postcode: 'TD12 4AA', expected: false },
    { postcode: 'TD12 4AH', expected: false },
    { postcode: 'OL2 5AA', expected: false },
  ])('Check if postcode is an MVP location %o', ({ postcode, expected }) => {
    expect(isPostcodeMVPLocation(postcode)).toEqual(expected);
  });
});

describe('setUserCaseWithRedisData', () => {
  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData parameters',
    () => {
      const req = mockRequest({ session: mockSession([], [], []) });
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Multiple"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"id":"testUserCaseId","state":"AWAITING_SUBMISSION_TO_HMCTS","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"],"tellUsWhatYouWant":[],"claimantRepresentedQuestion":"No","caseType":"Multiple"}'
      );
    }
  );

  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData, session.usercase is undefined',
    () => {
      const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
      req.session.userCase = undefined;
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Multiple"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"claimantRepresentedQuestion":"No","caseType":"Multiple","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"]}'
      );
    }
  );
});

describe('handleSessionErrors', () => {
  it('return PageUrls.CLAIM_SAVED when saveForLater and requiredErrors exists', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    const formField = mockFormField(
      'testFormField',
      'test name',
      'text',
      'test value',
      mockValidationCheckWithRequiredError(),
      'test label'
    );

    const form = mockForm({ testFormField: formField });
    const res = mockResponse();
    handleSessionErrors(req, res, form, '');
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
  });

  it('should throw error, when session errors exists and unable to save session', () => {
    const body = { testFormField: 'test value' };
    const err = new Error('Something went wrong');

    const req = mockRequestWithSaveException({
      body,
    });
    const formField = mockFormField(
      'testFormField',
      'test name',
      'text',
      'test value',
      mockValidationCheckWithRequiredError(),
      'test label'
    );
    const form = mockForm({ testFormField: formField });
    const res = mockResponse();
    expect(function () {
      handleSessionErrors(req, res, form, '');
    }).toThrow(err);
  });
});

describe('setUserCaseForRespondent', () => {
  it('should add new respondent to request when number of respondents is less than selectedRespondentIndex', () => {
    const req = mockRequest({
      session: mockSession([], [], []),
      body: { saveForLater: true, testFormField: 'test value' },
    });
    req.session.userCase = userCaseWith4Respondents;
    const formField = mockFormField(
      'testFormField',
      'test name',
      'text',
      'test value',
      mockValidationCheckWithOutError(),
      'test label'
    );
    req.params = { respondentNumber: '5' };
    const form = mockForm({ testFormField: formField });
    setUserCaseForRespondent(req, form);
    expect(req.session.userCase.respondents).toHaveLength(5);
  });
});
