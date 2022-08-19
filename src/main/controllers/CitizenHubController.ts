import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

// todo getSectionStatus(userCase?.personalDetailsCheck, userCase?.dobDate)
const sections = [
  {
    title: (l: AnyRecord): string => l.section1.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section1.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section2.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section2.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section3.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section3.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section4.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section4.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section5.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section5.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section5.link2Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section5.link3Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section6.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section6.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section7.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section7.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
  {
    title: (l: AnyRecord): string => l.section8.title,
    links: [
      {
        url: PageUrls.HOME,
        linkTxt: (l: AnyRecord): string => l.section8.link1Text,
        status: (l: AnyRecord): string => l.completed.title,
        statusColor: (l: AnyRecord): string => l.completed.style,
      },
    ],
  },
];

export default class CitizenHubController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase: req.session?.userCase,
      sections,
    });
  }
}
