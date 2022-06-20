import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers';
let employeeStatus: string;
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
        url: employeeStatus,
        linkTxt: (l: AnyRecord): string => l.section2.link1Text,
      },
      {
        url: PageUrls.RESPONDENT_NAME,
        linkTxt: (l: AnyRecord): string => l.section2.link2Text,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section3.title,
    links: [
      {
        url: PageUrls.SUMMARISE_YOUR_CLAIM,
        linkTxt: (l: AnyRecord): string => l.section3.link1Text,
      },

      {
        url: PageUrls.DESIRED_CLAIM_OUTCOME,
        linkTxt: (l: AnyRecord): string => l.section3.link2Text,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section4.title,
    links: [
      {
        url: PageUrls.CHECK_ANSWERS,
        linkTxt: (l: AnyRecord): string => l.section4.link1Text,
      },
    ],
  },
];

export default class StepsToMakingYourClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);

    sections[1].links[0].url = conditionalWorkingType(req);
    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
      sections,
    });
  }
}

const conditionalWorkingType = (req: AppRequest) => {
  if (req.session.userCase.typeOfClaim.includes(TypesOfClaim.UNFAIR_DISMISSAL)) {
    employeeStatus = PageUrls.STILL_WORKING;
  } else {
    employeeStatus = PageUrls.PAST_EMPLOYER;
  }
  return employeeStatus;
};
