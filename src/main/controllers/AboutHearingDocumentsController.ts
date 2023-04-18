import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('AboutHearingDocumentsController');

export default class AboutHearingDocumentsController {
  private form: Form;
  private aboutHearingDocumentsContent: FormContent;

  constructor() {
    // intentionally empty
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    logger.info('req.body is ', JSON.stringify(req.body));
    logger.info('the form is  ', this.form);
    const { userCase } = req.session;
    req.session.errors = [];
    const errorsForPage = () => {
      if (!req.body.aboutHearingDocuments) {
        logger.info('no about');
        req.session.errors.push({ propertyName: 'aboutHearingDocuments', errorType: 'required' });
      } else {
        userCase.aboutHearingDocuments = req.body.aboutHearingDocuments;
      }
      if (!req.body.whoseHearingDocumentsAreYouUploading) {
        logger.info('no whose');
        req.session.errors.push({ propertyName: 'whoseHearingDocumentsAreYouUploading', errorType: 'required' });
      } else {
        userCase.whoseHearingDocumentsAreYouUploading = req.body.whoseHearingDocumentsAreYouUploading;
      }
      if (!req.body.whatAreTheseDocuments) {
        logger.info('no what are');
        req.session.errors.push({ propertyName: 'whatAreTheseDocuments', errorType: 'required' });
      } else {
        userCase.whatAreTheseDocuments = req.body.whatAreTheseDocuments;
      }
    };

    errorsForPage();
    if (req.session.errors.length) {
      return res.redirect('/about-hearing-documents');
    }
    return res.redirect('/');
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const formatDate = (rawDate: Date): string =>
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(rawDate));
    // if no hearing collection we exit
    // do we retreive data in background
    // are attributes needed
    const radioBtns = req.session?.userCase?.hearingCollection
      .flatMap(hearing =>
        hearing.value.hearingDateCollection
          .filter(item => new Date(item.value.listedDate) > new Date())
          .map(item => ({
            label: `${hearing.value.Hearing_type} -  
      ${hearing.value?.Hearing_venue?.value?.label} - ${formatDate(item.value.listedDate)}`,
            value: `HearingId=${hearing.id}&dateId=${item.id}`,
            attributes: { maxLength: 2 },
            name: 'aboutHearingDocuments',
          }))
      )
      .map((hearing, index) => ({
        ...hearing,
        label: `${index + 1} ${hearing.label}`,
      }));

    logger.info('this is radio buttons ', JSON.stringify(radioBtns));

    this.aboutHearingDocumentsContent = {
      fields: {
        aboutHearingDocuments: {
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
              attributes: { maxLength: 2 },
            },
            {
              label: (l: AnyRecord): string => l.Question2Radio2,
              name: 'whoseHearingDocumentsAreYouUploading',
              value: 'BothPartiesHearingDocumentsCombined',
              attributes: { maxLength: 2 },
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
              attributes: { maxLength: 2 },
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio2,
              name: 'whatAreTheseDocuments',
              value: 'SupplementaryOrOtherDocuments',
              attributes: { maxLength: 2 },
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio3,
              name: 'whatAreTheseDocuments',
              value: 'WitnessStatementsOnly',
              attributes: { maxLength: 2 },
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
      //...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      cancelLink: `/citizen-hub/${req.session.userCase.id}${getLanguageParam(req.url)}`,
    });
  };
}
