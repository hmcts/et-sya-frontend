import config from 'config';
import { Response } from 'express';

import { Form } from '../../components/form/form';
import { isFieldFilledIn } from '../../components/form/validator';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';

const logger = getLogger('GroupRepresentativeController');

export default class GroupRepresentativeController {
  private readonly form: Form;
  private readonly groupRepresentativeContent: FormContent = {
    fields: {
      leadClaimant: {
        id: 'leadClaimant',
        name: 'leadClaimant',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            hint: (l: AnyRecord): string => l.noHint,
            value: YesOrNo.NO,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.groupRepresentativeContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.userCase.groupClaimsCheck = YesOrNo.NO;
    return handlePostLogic(req, res, this.form, logger, PageUrls.GROUP_CLAIMS_CHECK);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.groupRepresentativeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.GROUP_REPRESENTATIVE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());

    const myHmctsLink: string = process.env.MANAGE_CASE_URL ?? config.get('services.manageCase.url');
    res.render(TranslationKeys.GROUP_REPRESENTATIVE, {
      ...content,
      myHmctsLink,
    });
  };
}
