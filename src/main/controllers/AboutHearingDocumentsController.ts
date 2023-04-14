import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { assignFormData, getPageContent } from './helpers/FormHelpers';

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
    const hearings = req.session?.userCase?.hearingCollection.flatMap(hearing => {
      return hearing.value.hearingDateCollection.map(item => ({
        id: hearing.id,
        hearingType: hearing.value.Hearing_type,
        hearingStage: hearing.value.Hearing_stage,
        date: {
          listedDate: new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }).format(new Date(item.value.listedDate)),
          dateId: item.id,
        },
        venue: hearing.value?.Hearing_venue?.value?.label,
      }));
    });
    const radioBtns = hearings.map((hearing, index) => ({
      label: `${index + 1} ${hearing.hearingType} -  
      ${hearing.venue} - ${hearing.date.listedDate}`,
      name: 'radio' + index,
      value: `HearingId=${hearing.id}&dateId=${hearing.date.dateId}`,
      attributes: { maxLength: 2 },
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
          id: 'about-hearing-documents3',
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
    this.form = new Form(<FormFields>this.aboutHearingDocumentsContent.fields);
    const content = getPageContent(req, this.aboutHearingDocumentsContent, [TranslationKeys.COMMON]);

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('about-hearing-documents', {
      ...content,
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.ABOUT_HEARING_DOCUMENTS, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
    });
  };
}
