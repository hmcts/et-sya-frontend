import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('LinkedCasesController');

export default class LinkedCasesController {
  private readonly form: Form;

  private readonly linkedCasesContent: FormContent = {
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
            label: l => l.no,
            value: YesOrNo.NO,
          },
          {
            name: 'linkedCases',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            hint: (l: AnyRecord): string => l.textAreaHint,
            subFields: {
              linkedCasesDetail: {
                id: 'linkedCasesText',
                name: 'linkedCasesText',
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
    this.form = new Form(<FormFields>this.linkedCasesContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIM_DETAILS_CHECK);
  };

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.linkedCases = undefined;
      req.session.userCase.linkedCasesDetail = undefined;
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.linkedCasesContent, [
      TranslationKeys.COMMON,
      TranslationKeys.LINKED_CASES,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('linked-cases', {
      ...content,
    });
  };
}
