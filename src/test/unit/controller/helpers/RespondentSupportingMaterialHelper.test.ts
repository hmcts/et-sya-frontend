import { getFilesRows } from '../../../../main/controllers/helpers/RespondentSupportingMaterialHelper';
import { Document } from '../../../../main/definitions/case';
import { languages } from '../../../../main/definitions/constants';
import responseSupportingMaterialRaw from '../../../../main/resources/locales/en/translation/respondent-supporting-material.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

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
