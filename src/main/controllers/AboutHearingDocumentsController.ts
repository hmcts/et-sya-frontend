import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { Form } from '../components/form/form';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { isFieldFilledIn } from '../components/form/validator';
import { getLogger } from '../logger';
import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('AboutHearingDocumentsController');

export default class AboutHearingDocumentsController {
    private readonly form: Form;
    private readonly aboutHearingDocumentsContent: FormContent = {
      fields: {
        aboutHearingDocuments: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question1,
          labelSize: 'l',
          labelHidden: false,
          values: [
            {
              label: (l: AnyRecord): string => "Test string",
              name: 'radio1',
              value: 'Yes',
              attributes: { maxLength: 2 },
            },
            {
              label: (l: AnyRecord): string => "Test string 2",
              name: 'radio2',
              value: 'No',
              attributes: { maxLength: 2 },
            },
            {
                label: (l: AnyRecord): string => "Test string 3",
                name: 'radio3',
                value: 'No',
                attributes: { maxLength: 2 },
              },
          ],
          validator: isFieldFilledIn,
        },

        whoseHearingDocumentsAreYouUploading: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question2,
          labelSize: 'l',
          labelHidden: false,
          values: [
            {
              label: (l: AnyRecord): string => l.Question2Radio1,
              name: 'radio1',
              value: 'Yes',
              attributes: { maxLength: 2 },
            },
            {
              label: (l: AnyRecord): string => l.Question2Radio2,
              name: 'radio2',
              value: 'No',
              attributes: { maxLength: 2 },
            },
          ],
          validator: isFieldFilledIn,
        },

        whatAreTheseDocuments: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question3,
          labelSize: 'l',
          labelHidden: false,
          values: [
            {
              label: (l: AnyRecord): string => l.Question3Radio1,
              name: 'radio1',
              value: 'Yes',
              attributes: { maxLength: 2 },
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio2,
              name: 'radio2',
              value: 'No',
              attributes: { maxLength: 2 },
            },
            {
                label: (l: AnyRecord): string => l.Question3Radio3,
                name: 'radio3',
                value: 'No',
                attributes: { maxLength: 2 },
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
      this.form = new Form(<FormFields>this.aboutHearingDocumentsContent.fields);
    }
  
    public post = async (req: AppRequest, res: Response): Promise<void> => {
        await handlePostLogic(req, res, this.form, logger, 'url for next page');
    };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = getPageContent(req, this.aboutHearingDocumentsContent, [TranslationKeys.COMMON]);
      
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('about-hearing-documents', {
      ...content,
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t("about-hearing-documents", { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
    })
}}
