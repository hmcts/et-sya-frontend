import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { clearTseFields } from './ContactTheTribunalSelectedController';
import { setUserCase, submitClaimantTse } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('CopyToOtherPartyController');

export default class CopyToOtherPartyController {
  private readonly form: Form;

  private readonly CopyToOtherPartyContent: FormContent = {
    fields: {
      copyCorrespondence: {
        classes: 'govuk-radios',
        id: 'copyCorrespondence',
        type: 'radios',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'l',
        values: [
          {
            name: 'copyCorrespondence',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'copyCorrespondence',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
            subFields: {
              noCopyReason: {
                id: 'noCopyReason',
                name: 'noCopyReason',
                type: 'textarea',
                label: (l: AnyRecord): string => l.hintText,
                labelSize: 'm',
                isPageHeading: true,
                classes: 'govuk-textarea',
                attributes: { maxLength: 1500 },
                validator: isFieldFilledIn,
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
    this.form = new Form(<FormFields>this.CopyToOtherPartyContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    setUserCase(req, this.form);
    if (req.session.userCase.copyCorrespondence === YesOrNo.YES) {
      req.session.userCase.noCopyReason = undefined;
    }
    // Moved submission to here temporarily
    await submitClaimantTse(req, logger);
    clearTseFields(req.session.userCase);

    // TODO - insert the correct redirect urls
    res.redirect(PageUrls.APPLICATION_COMPLETE);
  };

  public get = (req: AppRequest, res: Response): void => {
    let captionSubject = '';
    let captionText = '';
    const contactType = req.session.contactType;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.COPY_TO_OTHER_PARTY, { returnObjects: true }),
    };
    if (contactType === translations.contact) {
      captionSubject = req.session.userCase.contactApplicationType;
      captionText = translations.sections[captionSubject].caption;
    }
    if (contactType === translations.application) {
      captionText = translations.respondToApplication;
    }
    if (contactType === translations.tribunal) {
      captionText = translations.respondToTribunal;
    }
    const content = getPageContent(req, this.CopyToOtherPartyContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COPY_TO_OTHER_PARTY,
    ]);

    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;
    res.render(TranslationKeys.COPY_TO_OTHER_PARTY, {
      ...content,
      copyCorrespondence: captionText,
      cancelLink: redirectUrl,
    });
  };
}
