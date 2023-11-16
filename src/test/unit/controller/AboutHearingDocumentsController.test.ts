import AboutHearingDocumentsController from '../../../main/controllers/AboutHearingDocumentsController';
import aboutHearingDocumentsJson from '../../../main/resources/locales/en/translation/about-hearing-documents.json';
import { mockHearingCollectionFutureDates } from '../mocks/mockHearing';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('About Hearing Documents Controller', () => {
  it('should render the About Hearing Documents page', () => {
    const controller = new AboutHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('about-hearing-documents', expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const expectedErrors = [{ propertyName: 'hearingDocumentsAreFor', errorType: 'required' }];
    const body = {
      whoseHearingDocumentsAreYouUploading: 'BothPartiesHearingDocumentsCombined',
      whatAreTheseDocuments: 'SupplementaryOrOtherDocuments',
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ body }, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;

    const controller = new AboutHearingDocumentsController();

    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });
  it('should redirect to the next page when there are no errors', () => {
    const body = {
      hearingDocumentsAreFor: '12345abc',
      whoseHearingDocumentsAreYouUploading: 'BothPartiesHearingDocumentsCombined',
      whatAreTheseDocuments: 'SupplementaryOrOtherDocuments',
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ body }, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;

    const controller = new AboutHearingDocumentsController();

    controller.post(request, response);
    expect(request.session.errors).toHaveLength(0);
    expect(response.redirect).toHaveBeenCalledWith('/hearing-document-upload/12345abc');
  });
  it('should return 2 errors when 2 questions are unanswered', () => {
    const expectedErrors = [
      { propertyName: 'hearingDocumentsAreFor', errorType: 'required' },
      { propertyName: 'whatAreTheseDocuments', errorType: 'required' },
    ];
    const body = {
      whoseHearingDocumentsAreYouUploading: 'BothPartiesHearingDocumentsCombined',
    };
    const response = mockResponse();
    const request = mockRequestWithTranslation({ body }, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;

    const controller = new AboutHearingDocumentsController();

    controller.post(request, response);
    expect(request.session.errors).toEqual(expectedErrors);
  });
  it('should redirect to the citizen hub if no hearings are present', () => {
    const controller = new AboutHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, aboutHearingDocumentsJson);

    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/citizen-hub/1234?lng=en');
  });
  it('should redirect back to the citizen hub if there are no hearings for future dates', () => {
    const controller = new AboutHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = [
      {
        id: '236c8a94-e485-4034-bbdb-99f982679138',
        value: {
          Hearing_type: 'Hearing',
          Hearing_notes: 'notes',
          Hearing_stage: 'Stage 1',
          Hearing_venue: {
            value: {
              code: 'RCJ',
              label: 'RCJ',
            },
            list_items: [
              {
                code: 'Field House',
                label: 'Field House',
              },
              {
                code: 'Fox Court rm 1',
                label: 'Fox Court rm 1',
              },
              {
                code: 'London Central',
                label: 'London Central',
              },
              {
                code: 'RCJ',
                label: 'RCJ',
              },
            ],
            selectedCode: 'RCJ',
            selectedLabel: 'RCJ',
          },
          hearingFormat: ['In person', 'Telephone', 'Video'],
          hearingNumber: '3333',
          hearingSitAlone: 'Sit Alone',
          judicialMediation: 'Yes',
          hearingEstLengthNum: 22,
          hearingPublicPrivate: 'Public',
          hearingDateCollection: [
            {
              id: '3890feaa-ad4b-4822-9040-3bc09279450a',
              value: {
                listedDate: new Date('2022-07-04T14:00:00.000'),
                Hearing_status: 'Listed',
                hearingVenueDay: {
                  value: {
                    code: 'Field House',
                    label: 'Field House',
                  },
                  list_items: [
                    {
                      code: 'Field House',
                      label: 'Field House',
                    },
                    {
                      code: 'Fox Court rm 1',
                      label: 'Fox Court rm 1',
                    },
                    {
                      code: 'London Central',
                      label: 'London Central',
                    },
                    {
                      code: 'RCJ',
                      label: 'RCJ',
                    },
                  ],
                  selectedCode: 'Field House',
                  selectedLabel: 'Field House',
                },
                hearingTimingStart: new Date('2022-04-13T11:00:00.000'),
                hearingTimingFinish: new Date('2022-04-13T11:00:00.000'),
              },
            },
          ],
        },
      },
    ];

    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/citizen-hub/1234?lng=en');
  });
});
