import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers';
//import { Respondent } from '../definitions/case';

const pageElements = [
  {
    title: (l: AnyRecord): string => l.title,
    subTitle: (l: AnyRecord): string => l.subTitle,
    links: [
      {
        url: PageUrls.RESPONDENT_NAME,
        linkTxt: (l: AnyRecord): string => l.name,
      },
      {
        url: PageUrls.RESPONDENT_ADDRESS,
        linkTxt: (l: AnyRecord): string => l.address,
      },
      {
        url: PageUrls.ACAS_CERT_NUM,
        linkTxt: (l: AnyRecord): string => l.acasNum,
      },
    ],
  },
];

export default class RespondentDetailsCheckController {
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_DETAILS_CHECK,
    ]);
    res.render(TranslationKeys.RESPONDENT_DETAILS_CHECK, {
      ...content,
      pageElements,
    });
  };
}
