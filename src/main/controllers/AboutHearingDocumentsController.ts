import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { WhatAreTheHearingDocuments, WhoseHearingDocument } from '../definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { aboutHearingDocumentsErrors } from './helpers/ErrorHelpers';
import { assignFormData, createRadioBtnsForHearings, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('AboutHearingDocumentsController');

export default class AboutHearingDocumentsController {
  private form: Form;
  private aboutHearingDocumentsContent: FormContent;

  private async getUserCaseId(req: AppRequest): Promise<string | undefined> {
    const userCase = fromApiFormat(
      (await getCaseApi(req.session.user?.accessToken).getUserCase(req.session.userCase.id)).data
    );
    return userCase?.id;
  }

  private getAboutHearingDocumentsContent(
    radioBtns: {
      name: string;
      label: string;
      value: string;
    }[]
  ): FormContent {
    return {
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
              value: WhoseHearingDocument.MINE,
            },
            {
              label: (l: AnyRecord): string => l.Question2Radio2,
              name: 'whoseHearingDocumentsAreYouUploading',
              value: WhoseHearingDocument.BOTH_PARTIES,
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
              value: WhatAreTheHearingDocuments.ALL,
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio2,
              name: 'whatAreTheseDocuments',
              value: WhatAreTheHearingDocuments.SUPPLEMENTARY,
            },
            {
              label: (l: AnyRecord): string => l.Question3Radio3,
              name: 'whatAreTheseDocuments',
              value: WhatAreTheHearingDocuments.WITNESS_STATEMENTS,
            },
          ],
          validator: isFieldFilledIn,
        },
      },
      submit: {
        text: (l: AnyRecord): string => l.continue,
      },
    };
  }

  constructor() {
    // intentionally empty
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    req.session.errors = [];
    userCase.whoseHearingDocumentsAreYouUploading = req.body.whoseHearingDocumentsAreYouUploading;
    userCase.whatAreTheseDocuments = req.body.whatAreTheseDocuments;

    const foundHearing = userCase.hearingCollection?.find(hearing => hearing.id === req.body.hearingDocumentsAreFor);
    if (!foundHearing) {
      req.session.errors.push({ propertyName: 'hearingDocumentsAreFor', errorType: 'required' });
    } else {
      userCase.hearingDocumentsAreFor = foundHearing.id;
    }

    req.session.errors = [...req.session.errors, ...aboutHearingDocumentsErrors(req)];
    if (req.session?.errors?.length) {
      return res.redirect(PageUrls.ABOUT_HEARING_DOCUMENTS);
    }

    return res.redirect(PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', foundHearing.id));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    try {
      const userCaseId = await this.getUserCaseId(req);
      if (!userCaseId) {
        return res.redirect(ErrorPages.NOT_FOUND);
      }

      if (!req.session?.userCase?.hearingCollection?.length) {
        logger.info('no hearing collection found, redirecting to citizen hub');
        return res.redirect(`/citizen-hub/${userCaseId}${getLanguageParam(req.url)}`);
      }

      const radioBtns = createRadioBtnsForHearings(req.session?.userCase?.hearingCollection);
      if (!radioBtns?.length) {
        logger.info('no hearing collection with future dates, redirecting to citizen hub');
        return res.redirect(`/citizen-hub/${userCaseId}${getLanguageParam(req.url)}`);
      }

      this.aboutHearingDocumentsContent = this.getAboutHearingDocumentsContent(radioBtns);
      this.form = new Form(<FormFields>this.aboutHearingDocumentsContent.fields);
      const content = getPageContent(req, this.aboutHearingDocumentsContent, [TranslationKeys.COMMON]);

      assignFormData(req.session.userCase, this.form.getFormFields());
      res.render(TranslationKeys.ABOUT_HEARING_DOCUMENTS, {
        ...content,
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.ABOUT_HEARING_DOCUMENTS, { returnObjects: true }),
        ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
        hideContactUs: true,
        cancelLink: `/citizen-hub/${userCaseId}${getLanguageParam(req.url)}`,
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect(`${ErrorPages.NOT_FOUND}${getLanguageParam(req.url)}`);
    }
  };
}
