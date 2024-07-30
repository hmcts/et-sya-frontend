import {
  findSelectedParamId,
  getFilesRows,
} from '../../../../main/controllers/helpers/RespondentSupportingMaterialHelper';
import { Document } from '../../../../main/definitions/case';
import { languages } from '../../../../main/definitions/constants';
import responseSupportingMaterialRaw from '../../../../main/resources/locales/en/translation/respondent-supporting-material.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import mockUserCase from '../../mocks/mockUserCase';

describe('getFilesRows', () => {
  it('should return file row with no file uploaded message', () => {
    const translationJsons = { ...responseSupportingMaterialRaw };
    const fileRows = getFilesRows(languages.ENGLISH_URL_PARAMETER, undefined, undefined, translationJsons);
    expect(fileRows[0].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      html: '<p class="govuk-body">No files uploaded</p>',
    });
  });

  it('should return uploaded file name and remove href', () => {
    const translationJsons = { ...responseSupportingMaterialRaw };
    const req = mockRequestWithTranslation({}, translationJsons);
    const userCase = req.session.userCase;
    const doc: Document = {
      document_url: '',
      document_filename: 'test.pdf',
      document_binary_url: '',
      document_size: 1000,
      document_mime_type: 'pdf',
    };
    userCase.supportingMaterialFile = doc;

    const fileRows = getFilesRows(languages.ENGLISH_URL_PARAMETER, userCase, '1', translationJsons);
    expect(fileRows[0].key).toEqual({
      classes: 'govuk-!-font-weight-regular-m',
      text: 'test.pdf',
    });
    expect(fileRows[0].actions).toEqual({
      items: [
        {
          href: '/remove-supporting-material/1?lng=en',
          text: 'Remove',
          visuallyHiddenText: 'Remove',
        },
      ],
    });
  });
});

describe('findSelectedParamId', () => {
  it('should return application id', () => {
    const userCase = mockUserCase;
    userCase.genericTseApplicationCollection = [
      {
        id: '123',
        value: {},
      },
    ];
    const actual = findSelectedParamId(userCase, '123');
    expect('123').toEqual(actual);
  });

  it('should return notification id', () => {
    const userCase = mockUserCase;
    userCase.sendNotificationCollection = [
      {
        id: '456',
        value: {},
      },
    ];
    const actual = findSelectedParamId(userCase, '456');
    expect('456').toEqual(actual);
  });

  it('should return undefined string with wrong id', () => {
    const userCase = mockUserCase;
    userCase.genericTseApplicationCollection = [
      {
        id: '123',
        value: {},
      },
    ];
    userCase.sendNotificationCollection = [
      {
        id: '456',
        value: {},
      },
    ];
    const actual = findSelectedParamId(userCase, '789');
    expect(undefined).toEqual(actual);
  });

  it('should return undefined string if no application or notification', () => {
    const userCase = mockUserCase;
    const actual = findSelectedParamId(userCase, '789');
    expect(undefined).toEqual(actual);
  });
});
