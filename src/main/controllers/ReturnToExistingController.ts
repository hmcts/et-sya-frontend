import config from 'config';
import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { ReturnToExistingOption } from '../definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { handlePostLogicPreLogin } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

export default class ReturnToExistingController {
  private readonly form: Form;
  private readonly returnToExistingContent: FormContent = {
    fields: {
      returnToExisting: {
        id: 'return_to_existing',
        type: 'radios',
        classes: 'govuk-radios',
        label: (l: AnyRecord): string => l.p2,
        labelSize: 'l',
        values: [
          {
            name: 'returnToExisting',
            label: (l: AnyRecord): string => l.optionText1,
            value: ReturnToExistingOption.DRAFT_CLAIM,
            subFields: {
              draftClaimOption: {
                id: 'draft_claim_option',
                type: 'radios',
                label: (l: AnyRecord): string => l.subQuestion,
                labelSize: 'm',
                values: [
                  {
                    name: 'draftClaimOption',
                    label: (l: AnyRecord): string => l.draftSubOptionText1,
                    value: ReturnToExistingOption.HAVE_ACCOUNT,
                  },
                  {
                    name: 'draftClaimOption',
                    label: (l: AnyRecord): string => l.draftSubOptionText2,
                    value: ReturnToExistingOption.RETURN_NUMBER,
                  },
                ],
              },
            },
          },
          {
            name: 'returnToExisting',
            label: (l: AnyRecord): string => l.optionText2,
            value: ReturnToExistingOption.SUBMITTED_CLAIM,
            subFields: {
              submittedClaimOption: {
                id: 'submitted_claim_option',
                type: 'radios',
                label: (l: AnyRecord): string => l.subQuestion,
                labelSize: 'm',
                values: [
                  {
                    name: 'submittedClaimOption',
                    label: (l: AnyRecord): string => l.submittedSubOptionText1,
                    value: ReturnToExistingOption.HAVE_ACCOUNT,
                  },
                  {
                    name: 'submittedClaimOption',
                    label: (l: AnyRecord): string => l.submittedSubOptionText2,
                    hint: (l: AnyRecord): string => l.submittedSubOptionHint2,
                    value: ReturnToExistingOption.CLAIM_BUT_NO_ACCOUNT,
                  },
                ],
              },
            },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.returnToExistingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const returnToExisting = req.body.returnToExisting;
    const draftClaimOption = req.body.draftClaimOption;
    const submittedClaimOption = req.body.submittedClaimOption;

    let redirectUrl: string = PageUrls.CASE_NUMBER_CHECK;

    if (returnToExisting === ReturnToExistingOption.DRAFT_CLAIM) {
      if (draftClaimOption === ReturnToExistingOption.HAVE_ACCOUNT) {
        redirectUrl = PageUrls.CLAIMANT_APPLICATIONS;
      } else if (draftClaimOption === ReturnToExistingOption.RETURN_NUMBER) {
        redirectUrl = `${process.env.ET1_BASE_URL ?? config.get('services.et1Legacy.url')}${LegacyUrls.ET1_SIGN_IN}`;
      }
    } else if (returnToExisting === ReturnToExistingOption.SUBMITTED_CLAIM) {
      if (submittedClaimOption === ReturnToExistingOption.HAVE_ACCOUNT) {
        redirectUrl = PageUrls.CLAIMANT_APPLICATIONS;
      } else if (submittedClaimOption === ReturnToExistingOption.CLAIM_BUT_NO_ACCOUNT) {
        req.session.visitedAssignClaimFlow = true;
        redirectUrl = PageUrls.CASE_NUMBER_CHECK;
      }
    }

    handlePostLogicPreLogin(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    req.session.guid = undefined;
    req.session.caseAssignmentFields = {}; // Clear case assignment flow fields
    req.session.visitedAssignClaimFlow = false;
    req.session.caseNumberChecked = false;
    req.session.yourDetailsVerified = false;
    const content = getPageContent(req, this.returnToExistingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RETURN_TO_EXISTING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('return-to-claim', {
      ...content,
    });
  };
}
