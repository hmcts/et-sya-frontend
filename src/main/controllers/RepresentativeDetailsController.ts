import { Response } from 'express';

import { Form } from '../components/form/form';
import { isFieldFilledIn } from '../components/form/validator';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('RepresentativeDetailsController');

export default class RepresentativeDetailsController {
  private readonly form: Form;
  private readonly representativeDetailsContent: FormContent = {
    fields: {
      representativeType: {
        id: 'representativeType',
        type: 'option',
        classes: 'govuk-select',
        label: (l: AnyRecord): string => l.typeOfRepresentative,
        labelSize: 'm',
        values: [
          { label: (l: AnyRecord): string => l.selectAType, value: '' },
          { label: (l: AnyRecord): string => l.employmentAdvisor, value: 'Employment Advisor' },
          { label: (l: AnyRecord): string => l.citizensAdviceBureau, value: 'Citizens Advice Bureau' },
          { label: (l: AnyRecord): string => l.freeRepresentationUnit, value: 'Free Representation Unit' },
          { label: (l: AnyRecord): string => l.lawCentre, value: 'Law Centre' },
          { label: (l: AnyRecord): string => l.tradeUnion, value: 'Trade Union' },
          { label: (l: AnyRecord): string => l.solicitor, value: 'Solicitor' },
          { label: (l: AnyRecord): string => l.privateIndividual, value: 'Private Individual' },
          { label: (l: AnyRecord): string => l.tradeAssociation, value: 'Trade Association' },
          { label: (l: AnyRecord): string => l.other, value: 'Other' },
        ],
        validator: isFieldFilledIn,
      },
      representativeOrgName: {
        id: 'representativeOrgName',
        name: 'representativeOrgName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.representativeOrgName,
        labelSize: 'm',
        attributes: { maxLength: 100 },
      },
      representativeName: {
        id: 'representativeName',
        name: 'representativeName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.representativeName,
        labelSize: 'm',
        attributes: { maxLength: 100 },
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.representativeDetailsContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.REPRESENTATIVE_POSTCODE_ENTER);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.representativeDetailsContent, [
      TranslationKeys.COMMON,
      TranslationKeys.REPRESENTATIVE_DETAILS,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.REPRESENTATIVE_DETAILS, {
      ...content,
    });
  };
}
