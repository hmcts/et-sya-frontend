import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers';

const sections = [
  {
    title: (l: AnyRecord): string => l.section1.title,
    links: [
      {
        url: PageUrls.DOB_DETAILS,
        linkTxt: (l: AnyRecord): string => l.section1.link1Text,
      },
      {
        url: PageUrls.ADDRESS_DETAILS,
        linkTxt: (l: AnyRecord): string => l.section1.link2Text,
      },
      {
        url: PageUrls.UPDATE_PREFERENCES,
        linkTxt: (l: AnyRecord): string => l.section1.link3Text,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section2.title,
    links: [
      {
        url: PageUrls.PAST_EMPLOYER.toString(),
        linkTxt: (l: AnyRecord): string => l.section2.link1Text,
      },
      {
        url: PageUrls.RESPONDENT_NAME.toString(),
        linkTxt: (l: AnyRecord): string => l.section2.link2Text,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section3.title,
    links: [
      {
        url: PageUrls.DESCRIBE_WHAT_HAPPENED.toString(),
        linkTxt: (l: AnyRecord): string => l.section3.link1Text,
      },

      {
        url: PageUrls.TELL_US_WHAT_YOU_WANT.toString(),
        linkTxt: (l: AnyRecord): string => l.section3.link2Text,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section4.title,
    links: [
      {
        url: PageUrls.CHECK_ANSWERS.toString(),
        linkTxt: (l: AnyRecord): string => l.section4.link1Text,
      },
    ],
  },
];

export default class StepsToMakingYourClaimController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);
    if (req.session.userCase.typeOfClaim.indexOf(TypesOfClaim.DISCRIMINATION) >= 0) {
      sections[2].links[0].url = PageUrls.CLAIM_TYPE_DISCRIMINATION.toString();
    } else if (req.session.userCase.typeOfClaim.indexOf(TypesOfClaim.BREACH_OF_CONTRACT)) {
      sections[2].links[0].url = PageUrls.CLAIM_TYPE_PAY;
    }
    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
      sections,
    });
  }
}
