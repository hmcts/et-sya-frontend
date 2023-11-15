import Controller from '../../../main/controllers/SubmitBundlesHearingDocsCYAController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AgreedDocuments, WhatAreTheHearingDocuments, WhoseHearingDocument } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Submit bundles cya Controller', () => {
  it('should redirect to PageUrls.BUNDLES_COMPLETED', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hearingCollection = mockHearingCollection;
    request.session.userCase.bundlesRespondentAgreedDocWith = AgreedDocuments.YES;
    request.session.userCase.bundlesRespondentAgreedDocWithBut = '';
    request.session.userCase.bundlesRespondentAgreedDocWithNo = '';
    request.session.userCase.hearingDocumentsAreFor = '12345-abc-12345';
    request.session.userCase.whatAreTheseDocuments = WhatAreTheHearingDocuments.ALL;
    request.session.userCase.whoseHearingDocumentsAreYouUploading = WhoseHearingDocument.MINE;
    await new Controller().get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.BUNDLES_COMPLETED);
  });

  it('should clear bundles fields after submitting bundles to ccd', async () => {
    const response = mockResponse();
    const request = mockRequest({});

    request.session.userCase.hearingCollection = mockHearingCollection;
    request.session.userCase.bundlesRespondentAgreedDocWith = AgreedDocuments.YES;
    request.session.userCase.bundlesRespondentAgreedDocWithBut = '';
    request.session.userCase.bundlesRespondentAgreedDocWithNo = '';
    request.session.userCase.hearingDocumentsAreFor = '12345-abc-12345';
    request.session.userCase.whatAreTheseDocuments = WhatAreTheHearingDocuments.ALL;
    request.session.userCase.whoseHearingDocumentsAreYouUploading = WhoseHearingDocument.MINE;

    jest.spyOn(CaseHelper, 'submitBundlesHearingDocs').mockImplementationOnce(() => Promise.resolve());
    await new Controller().get(request, response);
    expect(request.session.userCase.bundlesRespondentAgreedDocWith).toStrictEqual(undefined);
    expect(request.session.userCase.bundlesRespondentAgreedDocWithBut).toStrictEqual(undefined);
    expect(request.session.userCase.bundlesRespondentAgreedDocWithNo).toStrictEqual(undefined);
    expect(request.session.userCase.hearingDocumentsAreFor).toStrictEqual(undefined);
    expect(request.session.userCase.whatAreTheseDocuments).toStrictEqual(undefined);
    expect(request.session.userCase.whoseHearingDocumentsAreYouUploading).toStrictEqual(undefined);
  });
});
