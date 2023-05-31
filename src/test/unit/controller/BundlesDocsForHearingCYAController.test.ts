import BundlesDocsForHearingCYAController from '../../../main/controllers/BundlesDocsForHearingCYAController';
import { AgreedDocuments, WhatAreTheHearingDocuments, WhoseHearingDocument } from '../../../main/definitions/case';
import bundlesCYAJson from '../../../main/resources/locales/en/translation/bundles-docs-for-hearing-cya.json';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Bundles CYA Controller', () => {
  const translationJsons = { ...bundlesCYAJson };

  it('should render the Check your answers page', () => {
    const controller = new BundlesDocsForHearingCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, translationJsons);
    request.session.userCase.hearingCollection = mockHearingCollection;
    request.session.userCase.bundlesRespondentAgreedDocWith = AgreedDocuments.YES;
    request.session.userCase.bundlesRespondentAgreedDocWithBut = '';
    request.session.userCase.bundlesRespondentAgreedDocWithNo = '';
    request.session.userCase.hearingDocumentsAreFor = '12345-abc-12345';
    request.session.userCase.whatAreTheseDocuments = WhatAreTheHearingDocuments.ALL;
    request.session.userCase.whoseHearingDocumentsAreYouUploading = WhoseHearingDocument.MINE;
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('bundles-docs-for-hearing-cya', expect.anything());
  });
});
