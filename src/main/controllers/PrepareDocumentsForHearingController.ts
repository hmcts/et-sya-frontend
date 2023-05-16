import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { AgreedDocuments } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('PrepareDocumentsForHearingController');

export default class PrepareDocumentsForHearingController {
  private readonly form: Form;

  private readonly prepareDocumentsForHearingContent: FormContent = {
    fields: {
      prepareDocumentsForHearing: {
        classes: 'govuk-radios',
        id: 'prepareDocumentsForHearing',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelSize: 'l',
        labelHidden: false,
        values: [
          {
            name: 'prepareDocumentsForHearing',
            label: (l: AnyRecord): string => l.yes,
            value: AgreedDocuments.AGREED,
          },
          {
            name: 'prepareDocumentsForHearing',
            label: (l: AnyRecord): string => l.agreed,
            value: AgreedDocuments.AGREEDBUT,
            subFields: {
              disputedDocuments: {
                id: 'disputedDocumentsDetailText',
                name: 'disputedDocumentsDetailText',
                type: 'textarea',
                hint: (l: AnyRecord): string => l.agreedTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 2500 },
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'prepareDocumentsForHearing',
            label: (l: AnyRecord): string => l.notAgreed,
            value: AgreedDocuments.NOTAGREED,
            subFields: {
              notAgreed: {
                id: 'notAgreedDetailText',
                name: 'notAgreedDetailText',
                type: 'textarea',
                hint: (l: AnyRecord): string => l.notAgreedTextLabel,
                classes: 'govuk-textarea',
                attributes: { maxLength: 2500 },
                validator: isFieldFilledIn,
              },
            },
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.prepareDocumentsForHearingContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.ABOUT_HEARING_DOCUMENTS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session?.userCase;
    const content = getPageContent(req, this.prepareDocumentsForHearingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.PREPARE_DOCUMENTS_FOR_HEARING,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('prepare-documents-for-hearing', {
      ...content,
      cancelLink: `/citizen-hub/${userCase.id}${getLanguageParam(req.url)}`,
    });
  };
}
