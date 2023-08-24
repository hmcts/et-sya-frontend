import { Response } from 'express';

import { Form } from '../components/form/form';
import { atLeastOneFieldIsChecked } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getAppDetailsLink, getCancelLink } from './helpers/Rule92NotSystemUserHelper';
import { getCaptionTextForStoredContact, getTseApplicationDetailsTable } from './helpers/StoredContactToSubmitHelper';

const logger = getLogger('StoredToSubmitController');

export default class StoredToSubmitController {
  private readonly form: Form;

  private readonly StoredToSubmitContent: FormContent = {
    fields: {
      confirmCopied: {
        id: 'confirmCopied',
        label: l => l.haveYouCopied,
        labelHidden: false,
        labelSize: 'm',
        type: 'checkboxes',
        hint: l => l.iConfirmThatIHaveCopied,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'confirmCopied',
            label: l => l.yesIConfirm,
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
    await handlePostLogic(req, res, this.form, logger, PageUrls.STORED_TO_SUBMIT_CYA);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.StoredToSubmitContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_TO_SUBMIT,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('stored-to-submit', {
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
