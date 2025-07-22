import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContentBetween3And100Chars } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('WhistleblowingClaimsController');

export default class WhistleblowingClaimsController {
  private readonly form: Form;
  private readonly whistleblowingClaimsFormContent: FormContent = {
    fields: {
      whistleblowingClaim: {
        id: 'whistleblowing-claim',
        type: 'radios',
        classes: 'govuk-radios',
        label: l => l.forwardClaim,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              whistleblowingEntityName: {
                id: 'whistleblowing-entity-name',
                name: 'whistleblowing-entity-name',
                label: (l: AnyRecord): string => l.regOrBodyName,
                labelHidden: false,
                labelSize: 'normal',
                type: 'text',
                validator: isContentBetween3And100Chars,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.whistleblowingClaimsFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(this.checkWhistleBlowingClaimYesNo(req), res, this.form, logger, PageUrls.LINKED_CASES);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.whistleblowingClaimsFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.WHISTLEBLOWING_CLAIMS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.WHISTLEBLOWING_CLAIMS, {
      ...content,
    });
  };

  private checkWhistleBlowingClaimYesNo(req: AppRequest): AppRequest {
    if (req.body.whistleblowingClaim === YesOrNo.NO) {
      req.session.userCase.whistleblowingEntityName = undefined;
    }
    return req;
  }
}
