import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { setUserCase } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/Rule92NotSystemUserHelper';
import { getCaptionTextForStoredContact, getTseApplicationDetailsTable } from './helpers/StoredContactToSubmitHelper';

export default class StoredToSubmitController {
  private readonly form: Form;

  private readonly StoredToSubmitContent: FormContent = {
    fields: {
      confirmCopied: {
        id: 'confirmCopied',
        labelHidden: true,
        type: 'checkboxes',
        isPageHeading: true,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'yes',
            label: l => l.YesIConfirm.checkbox,
            value: YesOrNo.YES,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.StoredToSubmitContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    const languageParam = getLanguageParam(req.url);
    const redirectPage = PageUrls.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER + languageParam;
    return res.redirect(redirectPage);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.StoredToSubmitContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_TO_SUBMIT,
    ]);

    res.render(TranslationKeys.STORED_TO_SUBMIT, {
      ...content,
      applicationType: getCaptionTextForStoredContact(req),
      appContent: getTseApplicationDetailsTable(req),
      thisCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      thisCorrespondenceFileLink: '#',
      thisCorrespondenceFileName: '[file_name_of_supporting_doc]',
      cancelLink: getCancelLink(req),
    });
  };
}
