import { CaseWithId } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

export const getRule92AnswerDetails = (
  userCase: CaseWithId,
  translations: AnyRecord
): { key: unknown; value?: unknown; actions?: unknown }[] => {
  const employmentDetails = [];
  employmentDetails.push(
    {
      key: {
        text: translations.selectAnApplication,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: 'Claimant - strike out all or part of the response',
      },
      actions: {
        items: [
          {
            href: PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.selectAnApplication,
          },
        ],
      },
    },
    {
      key: {
        text: translations.whatsYourResponse,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: 'We disagree with the strike out request, we have evidence to backup the response.',
      },
      actions: {
        items: [
          {
            href: PageUrls.PAST_EMPLOYER + InterceptPaths.ANSWERS_CHANGE,
            text: translations.change,
            visuallyHiddenText: translations.whatsYourResponse,
          },
        ],
      },
    }
  );
  return employmentDetails;
};
