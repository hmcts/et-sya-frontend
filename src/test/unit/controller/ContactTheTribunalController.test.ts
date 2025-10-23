import ContactTheTribunalController from '../../../main/controllers/ContactTheTribunalController';
import { YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import contactTheTribunal from '../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockHearingCollectionFutureDates } from '../mocks/mockHearing';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Application Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render contact application page', async () => {
    const controller = new ContactTheTribunalController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTheTribunal);

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_THE_TRIBUNAL, expect.anything());
  });

  it('should render accordion items', async () => {
    const controller = new ContactTheTribunalController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTheTribunal);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_THE_TRIBUNAL,
      expect.objectContaining({
        applicationsAccordionItems: expect.arrayContaining([
          {
            heading: { text: expect.any(String) },
            content: {
              bodyText: expect.any(String),
              link: {
                href: '/contact-the-tribunal/change-details?lng=en',
                text: expect.any(String),
              },
            },
          },
        ]),
      })
    );
  });

  it('should render the document bundle accordion item when hearings exist', async () => {
    const controller = new ContactTheTribunalController();

    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTheTribunal);
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;
    request.session.userCase.claimantRepresentedQuestion = YesOrNo.NO;

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_THE_TRIBUNAL,
      expect.objectContaining({
        applicationsAccordionItems: expect.arrayContaining([
          {
            heading: { text: expect.any(String) },
            content: {
              bodyText: expect.any(String),
              link: {
                href: '/prepare-documents?lng=en',
                text: expect.any(String),
              },
            },
          },
        ]),
      })
    );
  });

  it('should not render the document bundle accordion item when no hearings', async () => {
    const controller = new ContactTheTribunalController();

    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTheTribunal);
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_THE_TRIBUNAL,
      expect.objectContaining({
        applicationsAccordionItems: expect.not.arrayContaining([
          {
            heading: { text: expect.any(String) },
            content: {
              bodyText: expect.any(String),
              link: {
                href: '/prepare-documents?lng=en',
                text: expect.any(String),
              },
            },
          },
        ]),
      })
    );
  });
});
