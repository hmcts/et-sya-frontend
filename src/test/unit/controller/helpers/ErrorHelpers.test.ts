import {
  getACASCertificateNumberError,
  getApplicationResponseErrors,
  getClaimSummaryError,
  getCopyToOtherPartyError,
  getCustomStartDateError,
  getFileErrorMessage,
  getLastFileError,
  getNewJobPartialPayInfoError,
  getOtherClaimDescriptionError,
  getPartialPayInfoError,
  handleErrors,
  returnSessionErrors,
} from '../../../../main/controllers/helpers/ErrorHelpers';
import { PayInterval, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { StartDateFormFields } from '../../../../main/definitions/dates';
import { TypesOfClaim } from '../../../../main/definitions/definition';
import { FormError } from '../../../../main/definitions/form';
import { AnyRecord } from '../../../../main/definitions/util-types';
import contactTheTribunalSelectedRaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal-selected.json';
import { mockSession } from '../../mocks/mockApp';
import { mockFile } from '../../mocks/mockFile';
import { mockForm, mockFormField, mockValidationCheckWithRequiredError } from '../../mocks/mockForm';
import { mockRequest, mockRequestWithSaveException, mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('getCustomStartDateError', () => {
  it("should not raise an error if one of the dates isn't provided", () => {
    const req = mockRequest({
      session: mockSession([], [], []),
    });

    expect(getCustomStartDateError(req, undefined, {})).toBeUndefined();

    expect(
      getCustomStartDateError(req, undefined, { startDate: { year: '1987', month: '6', day: '27' } })
    ).toBeUndefined();

    expect(
      getCustomStartDateError(
        mockRequest({
          session: { ...mockSession([], [], []), userCase: { dobDate: { year: '1966', month: '1', day: '6' } } },
        }),
        undefined,
        {}
      )
    ).toBeUndefined();
  });

  it('should error when start date is before birthday', () => {
    expect(
      getCustomStartDateError(
        mockRequest({
          session: { ...mockSession([], [], []), userCase: { dobDate: { year: '1966', month: '1', day: '6' } } },
        }),
        mockForm({ startDate: StartDateFormFields }),
        { startDate: { year: '1000', month: '6', day: '27' } }
      )
    ).toStrictEqual({ errorType: 'invalidDateBeforeDOB', propertyName: 'startDate' });
  });
});

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
  it('should not return an error if only text has been provided', () => {
    const body = { claimSummaryText: 'text' };

    const errors = getClaimSummaryError(body, undefined, undefined);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if only a file has been provided', () => {
    const body = {};

    const errors = getClaimSummaryError(body, mockFile, undefined);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if file has previously been uploaded', () => {
    const body = { claimSummaryText: '' };

    const errors = getClaimSummaryError(body, undefined, 'testfile.pdf');

    expect(errors).toEqual(undefined);
  });

  it('should return required error if neither text, file or previous file has been provided', () => {
    const body = {
      claimSummaryText: '',
      claimSummaryFileName: '',
    };

    const errors = getClaimSummaryError(body, undefined, undefined);

    expect(errors).toEqual({ propertyName: 'claimSummaryText', errorType: 'required' });
  });
});

describe('getOtherClaimDescriptionError', () => {
  it('should not return an error if otherTypesOfClaims not ticked', () => {
    const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT, TypesOfClaim.DISCRIMINATION] };

    const errors = getOtherClaimDescriptionError(body);

    expect(errors).toEqual(undefined);
  });

  it('should not return an error if otherTypesOfClaims ticked and other type provided', () => {
    const body = {
      typeOfClaim: [TypesOfClaim.OTHER_TYPES],
      otherClaim: 'anything',
    };

    const errors = getOtherClaimDescriptionError(body);

    expect(errors).toEqual(undefined);
  });

  it('should return error if otherTypesOfClaims ticked and other type not provided', () => {
    const body = {
      typeOfClaim: [TypesOfClaim.OTHER_TYPES],
      otherClaim: '',
    };

    const errors = getOtherClaimDescriptionError(body);

    expect(errors).toStrictEqual({ errorType: 'required', propertyName: 'otherClaim' });
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

  it('should return an error if more than 2000 chars are entered', () => {
    const body = {
      typeOfClaim: ['otherTypesOfClaims'],
      otherClaim: '1'.repeat(2001),
    };

    const errors = getOtherClaimDescriptionError(body);
    expect(errors).toEqual({ errorType: 'tooLong', propertyName: 'otherClaim' });
  });

  it('should return an error if other type text area is empty', () => {
    const body = {
      typeOfClaim: ['otherTypesOfClaims'],
      otherClaim: '',
    };

    const errors = getOtherClaimDescriptionError(body);
    expect(errors).toEqual({ errorType: 'required', propertyName: 'otherClaim' });
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

describe('returnSessionErrors + handleErrors', () => {
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

    const errors = returnSessionErrors(req, form);
    handleErrors(req, res, errors);
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

    const errors = returnSessionErrors(req, form);
    expect(function () {
      handleErrors(req, res, errors);
    }).toThrow(err);
  });
});

describe('getCopyToOtherPartyError', () => {
  it('should require one of the radio buttons to be selected', () => {
    expect(getCopyToOtherPartyError({})).toStrictEqual({
      errorType: 'required',
      propertyName: 'copyToOtherPartyYesOrNo',
    });
  });

  describe('selecting to not copy to other party', () => {
    it('should not allow empty text', () => {
      expect(getCopyToOtherPartyError({ copyToOtherPartyYesOrNo: YesOrNo.NO })).toStrictEqual({
        errorType: 'required',
        propertyName: 'copyToOtherPartyText',
      });
    });

    it('should not allow too large a text', () => {
      expect(
        getCopyToOtherPartyError({ copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: '1'.repeat(2501) })
      ).toStrictEqual({
        errorType: 'tooLong',
        propertyName: 'copyToOtherPartyText',
      });
    });
  });

  it('should not error on a valid input', () => {
    expect(
      getCopyToOtherPartyError({ copyToOtherPartyYesOrNo: YesOrNo.NO, copyToOtherPartyText: 'test' })
    ).toBeUndefined();
  });
});

describe('getLastFileError', () => {
  it("should return nothing when there aren't any file errors", () => {
    expect(
      getLastFileError([
        { propertyName: 'a', errorType: 'A' },
        { propertyName: 'b', errorType: 'B' },
        { propertyName: 'c', errorType: 'C' },
      ])
    ).toBeUndefined();
  });

  it('should return last file error when there are multiple of them', () => {
    expect(
      getLastFileError([
        { propertyName: 'contactApplicationFile', errorType: 'A' },
        { propertyName: 'b', errorType: 'B' },
        { propertyName: 'contactApplicationFile', errorType: 'C' },
        { propertyName: 'd', errorType: 'D' },
      ])
    ).toStrictEqual({
      propertyName: 'contactApplicationFile',
      errorType: 'C',
    });
  });

  describe('getApplicationResponseError', () => {
    it('should not return error when no error', () => {
      expect(
        getApplicationResponseErrors({
          respondToApplicationText: 'help',
          hasSupportingMaterial: YesOrNo.NO,
        })
      ).toBeUndefined();
    });

    it('should return error when nothing entered', () => {
      expect(
        getApplicationResponseErrors({
          respondToApplicationText: undefined,
          hasSupportingMaterial: undefined,
        })
      ).toStrictEqual({
        propertyName: 'respondToApplicationText',
        errorType: 'required',
      });
    });

    it('should return error when response details field is entered, but a radio button is not selected', () => {
      expect(
        getApplicationResponseErrors({
          respondToApplicationText: 'help',
          hasSupportingMaterial: undefined,
        })
      ).toStrictEqual({
        propertyName: 'hasSupportingMaterial',
        errorType: 'required',
      });
    });

    it('should return error when response details is blank and No radio button is selected', () => {
      expect(
        getApplicationResponseErrors({
          respondToApplicationText: undefined,
          hasSupportingMaterial: YesOrNo.NO,
        })
      ).toStrictEqual({
        propertyName: 'respondToApplicationText',
        errorType: 'requiredFile',
      });
    });

    it('should return error when response details is more than 2500 characters', () => {
      const testString = 'a'.repeat(2501);
      expect(
        getApplicationResponseErrors({
          respondToApplicationText: testString,
          hasSupportingMaterial: YesOrNo.NO,
        })
      ).toStrictEqual({
        propertyName: 'respondToApplicationText',
        errorType: 'tooLong',
      });
    });
  });
});

describe('getFileErrorMessage', () => {
  it("should return undefined when there aren't any file errors", () => {
    const translationJsons = { ...contactTheTribunalSelectedRaw };
    const req = mockRequestWithTranslation({ body: { contactApplicationText: 'test' } }, translationJsons);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, { returnObjects: true }),
    };
    expect(getFileErrorMessage(undefined, translations)).toBeUndefined();
  });

  it('should return file error message', () => {
    const translationJsons = { ...contactTheTribunalSelectedRaw };
    const req = mockRequestWithTranslation({ body: { contactApplicationText: 'test' } }, translationJsons);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, { returnObjects: true }),
    };
    const mockError = {
      errorType: 'invalidFileFormat',
      propertyName: 'supportingMaterialFile',
    } as FormError;

    expect(getFileErrorMessage([mockError], translations)).toBeUndefined();
  });
});
