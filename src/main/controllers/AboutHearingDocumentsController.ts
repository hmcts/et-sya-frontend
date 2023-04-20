import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { aboutHearingDocumentsErrors } from './helpers/ErrorHelpers';
import { assignFormData, createRadioBtnsForAboutHearingDocs, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('AboutHearingDocumentsController');

export default class AboutHearingDocumentsController {
  private form: Form;
  private aboutHearingDocumentsContent: FormContent;

  constructor() {
    // intentionally empty
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    req.session.errors = [];

    userCase.hearingDocumentsAreFor = req.body.hearingDocumentsAreFor;
    userCase.whoseHearingDocumentsAreYouUploading = req.body.whoseHearingDocumentsAreYouUploading;
    userCase.whatAreTheseDocuments = req.body.whatAreTheseDocuments;

    req.session.errors = aboutHearingDocumentsErrors(req);
    if (req.session.errors.length) {
      return res.redirect('/about-hearing-documents');
    }
    return res.redirect('/');
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (!req.session?.userCase?.hearingCollection?.length) {
      logger.info('no hearing collection found, redirecting to citizen hub');
      return res.redirect(`/citizen-hub/${req.session.userCase.id}${getLanguageParam(req.url)}`);
    }

    const radioBtns = createRadioBtnsForAboutHearingDocs(req.session?.userCase?.hearingCollection);

    if (!radioBtns?.length) {
      logger.info('no hearing collection with future dates, redirecting to citizen hub');
      return res.redirect(`/citizen-hub/${req.session.userCase.id}${getLanguageParam(req.url)}`);
    }

    this.aboutHearingDocumentsContent = {
      fields: {
        hearingDocumentsAreFor: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents1',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question1,
          labelSize: 'l',
          labelHidden: false,
          values: radioBtns,
          validator: isFieldFilledIn,
        },
        whoseHearingDocumentsAreYouUploading: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents2',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question2,
          labelSize: 'l',
          labelHidden: false,
          values: [
            {
              label: (l: AnyRecord): string => l.Question2Radio1,
              name: 'whoseHearingDocumentsAreYouUploading',
              value: 'MyHearingDocuments',
            },
            {
              label: (l: AnyRecord): string => l.Question2Radio2,
              name: 'whoseHearingDocumentsAreYouUploading',
              value: 'BothPartiesHearingDocumentsCombined',
            },
          ],
          validator: isFieldFilledIn,
        },
        whatAreTheseDocuments: {
          classes: 'govuk-radios',
          id: 'about-hearing-documents3',
          type: 'radios',
          label: (l: AnyRecord): string => l.Question3,
          labelSize: 'l',
          labelHidden: false,
          values: [
            {
              label: (l: AnyRecord): string => l.Question3Radio1,
              name: 'whatAreTheseDocuments',
              value: 'AllHearingDocuments',
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio2,
              name: 'whatAreTheseDocuments',
              value: 'SupplementaryOrOtherDocuments',
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio3,
              name: 'whatAreTheseDocuments',
              value: 'WitnessStatementsOnly',
            },
          ],
          validator: isFieldFilledIn,
        },
      },
      submit: {
        text: (l: AnyRecord): string => l.continue,
      },
    };
    this.form = new Form(<FormFields>this.aboutHearingDocumentsContent.fields);
    const content = getPageContent(req, this.aboutHearingDocumentsContent, [TranslationKeys.COMMON]);

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('about-hearing-documents', {
      ...content,
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.ABOUT_HEARING_DOCUMENTS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      cancelLink: `/citizen-hub/${req.session.userCase.id}${getLanguageParam(req.url)}`,
    });
  };
}
