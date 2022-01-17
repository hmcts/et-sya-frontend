import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';

export default class AddressDetailsController {
  private readonly form: Form

  constructor(private readonly formContent: FormContent) {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    let sessionErrors = req.session?.errors || [];
    const formData = this.form.getParsedBody(req.body, this.formContent.fields);

    if (!req.session.userCase) {
      req.session.userCase = {} as CaseWithId;
    }
    Object.assign(req.session.userCase, formData);

    sessionErrors = this.form.getErrors(formData);
    req.session.errors = sessionErrors;

    if (sessionErrors.length > 0) {
      req.session.save((err) => {
        if (err) {
          throw err;
        }
        res.redirect(req.url);
      });
    } else {
      // TODO(Tautvydas): change this route to a correct one
      // once the next page exists.
      res.redirect('/');
    }
  }

  public get = (req: AppRequest, res: Response): void => {
    const sessionErrors = req.session?.errors || [];
    const userCase = req.session?.userCase;

    res.render('address-details', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('address-details', { returnObjects: true }),
      form: this.formContent,
      sessionErrors,
      userCase,
    });
  }
}
