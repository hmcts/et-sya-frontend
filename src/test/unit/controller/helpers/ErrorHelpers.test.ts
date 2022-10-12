import {
  getACASCertificateNumberError,
  getClaimSummaryError,
  getNewJobPartialPayInfoError,
  getPartialPayInfoError,
  handleSessionErrors,
} from '../../../../main/controllers/helpers/ErrorHelpers';
import { PayInterval, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { mockSession } from '../../mocks/mockApp';
import { mockFile } from '../../mocks/mockFile';
import { mockForm, mockFormField, mockValidationCheckWithRequiredError } from '../../mocks/mockForm';
import { mockRequest, mockRequestWithSaveException } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

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

describe('Claim Summary Error', () => {
  it('should not return any errors when not on the summary page', () => {
    const body = {};

    const errors = getClaimSummaryError(body, undefined);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if only text has been provided', () => {
    const body = { claimSummaryText: 'text' };

    const errors = getClaimSummaryError(body, undefined);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if only a file has been provided', () => {
    const body = {};

    const errors = getClaimSummaryError(body, mockFile);

    expect(errors).toEqual(undefined);
  });

  it('should return required error if neither text nor file has been provided', () => {
    const body = {
      claimSummaryText: '',
      claimSummaryFileName: '',
    };

    const errors = getClaimSummaryError(body, undefined);

    expect(errors).toEqual({ propertyName: 'claimSummaryText', errorType: 'required' });
  });

  it('should return textAndFile error if neither text nor file has been provided', () => {
    const body = {
      claimSummaryText: 'text',
    };

    const errors = getClaimSummaryError(body, mockFile);

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
