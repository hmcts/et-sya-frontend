import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
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
];

export default class StepsToMakingYourClaimController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);

    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
      sections,
    });
  }
}
