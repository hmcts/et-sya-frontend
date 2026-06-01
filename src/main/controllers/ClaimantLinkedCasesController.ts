import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { renderPage } from './helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantLinkedCasesController');

export default class ClaimantLinkedCasesController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      linkedCases: {
        classes: 'govuk-radios',
        id: 'linkedCases',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        values: [
          {
            name: 'linkedCases',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
          {
            name: 'linkedCases',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              linkedCasesDetail: {
                id: 'linkedCasesDetail',
                name: 'linkedCasesDetail',
                type: 'textarea',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.linkedCasesTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 2500 },
              },
            },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIM_DETAILS_CHECK);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_LINKED_CASES);
  };
}
