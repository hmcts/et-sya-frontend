import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

// const sections: AnyRecord[] = [
//   {
//     sectionTitle: 'Section 1',
//     sectionLinks: ['<a href="#">Link 1</a>'],
//   },
// ];

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
