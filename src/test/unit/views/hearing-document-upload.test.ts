import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const titleClass = 'govuk-heading-xl';
const buttonClass = 'govuk-button';
const fileUploadId = 'hearingDocument';
const expectedTitle = 'Upload your file of documents';

let htmlRes: Document;

describe('Hearing Document Upload', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get('/hearing-document-upload/123')
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display file upload', () => {
    const fileUpload = htmlRes.getElementById(fileUploadId);
    expect(fileUpload.id).equals(fileUploadId, 'Could not find file upload');
  });

  it('should display upload file button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Upload file', 'Could not find the upload button');
  });
  it('should display continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Continue', 'Could not find the continue button');
  });
});
