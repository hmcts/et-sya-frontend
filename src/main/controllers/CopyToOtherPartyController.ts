import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';

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
  };

  constructor() {
    this.form = new Form(<FormFields>this.CopyToOtherPartyContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // TODO - insert the correct redirect urls
    await handlePostLogic(req, res, this.form, logger, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    // TODO add correct logic to display the application type
    // const applicationType = applications[applicationIndex].applicationType;
    const content = getPageContent(req, this.CopyToOtherPartyContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COPY_TO_OTHER_PARTY,
    ]);

    // copyCorrespondence.label = (l: AnyRecord): string => applicationType;
    // assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.COPY_TO_OTHER_PARTY, {
      ...content,
      //  applicationType: applicationType,
    });
  };
}
