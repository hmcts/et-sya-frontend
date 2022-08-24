import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CaseState } from '../definitions/definition';
import { createHubSections, hubLinksMap } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { currentStateFn } from '../helper/state-sequence';

export default class CitizenHubController {
  public get(req: AppRequest, res: Response): void {
    const userCase =
      req.session?.userCase ||
      // todo remove this when user case loaded from DB.
      ({
        id: '123',
        ethosCaseReference: '654321/2022',
        firstName: 'Paul',
        lastName: 'Mumbere',
        respondents: [{ respondentNumber: 1, respondentName: 'Itay' }],
        state: CaseState.ACCEPTED,
        et3IsThereAnEt3Response: YesOrNo.YES,
      } as CaseWithId);

    userCase.hubLinks = userCase.hubLinks || createHubSections();

    const currentState = currentStateFn(userCase);

    const sections = userCase.hubLinks.map((section, sectionIndex) => {
      const sectionName = `section${sectionIndex + 1}`;
      return {
        title: (l: AnyRecord): string => l[sectionName].title,
        links: section.links.map((link, linkIndex) => {
          return {
            url: link.link,
            linkTxt: (l: AnyRecord): string => l[sectionName][`link${linkIndex + 1}Text`],
            status: (l: AnyRecord): string => l[link.status],
            statusColor: () => hubLinksMap.get(link.status),
          };
        }),
      };
    });

    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      currentState,
      sections,
    });
  }
}
