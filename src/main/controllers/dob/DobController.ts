import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields, FormOptions } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';

export default class DobController {
  private readonly form: Form

  constructor(private readonly formContent: FormContent) {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    let sessionErrors = req.session?.errors || [];
    const formData = this.form.getParsedBody(req.body, this.formContent.fields);

    if (!req.session.userCase) {
      req.session.userCase = {} as any;
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
      res.redirect('/');
    }
  }

  public get = (req: AppRequest, res: Response): void => {
    const sessionErrors = req.session?.errors || [];
    const userCase = req.session.userCase;

    this.assignUserCaseData(userCase, this.formContent);
    req.session.userCase = userCase;

    res.render('date-of-birth', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('date-of-birth', { returnObjects: true }),
      form: this.formContent,
      sessionErrors,
      userCase,
    });
  }

  private assignUserCaseData = (userCase: any, form: FormContent): void => {
    if (userCase) {
      Object.entries(form.fields).forEach(
        ([name, field]: [string, FormOptions]) => {
          if (userCase[name]) {
            const fromCase = userCase[name];
            const values = field.values;

            ((form.fields as FormFields)[name] as FormOptions).values = values.map((v) => {
              Object.keys(fromCase).forEach((key) => {
                if (v.name === key) {
                  v.value = fromCase[key];
                }
              });
              return v;
            });
          }
        },
      );
    }
  }
}
