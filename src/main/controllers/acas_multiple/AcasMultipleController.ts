import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormOptions, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from 'definitions/case';

export default class AcasMultipleController {
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
    const userCase = req.session?.userCase;

    this.assignUserCaseData(userCase, this.formContent);
    req.session.userCase = userCase;

    res.render('acas-multiple', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('acas-multiple', { returnObjects: true }),
      form: this.formContent,
      sessionErrors,
      userCase,
    });
  }

  private assignUserCaseData = (userCase: CaseWithId | undefined, form: FormContent): void => {
    if (!userCase) {
      userCase = <CaseWithId>{};
      return;
    }

    Object.entries(form.fields).forEach(
      ([name, field]: [string, FormOptions]) => {
        const caseName = (userCase as any)[name];
        if (caseName) {
          const fromCase = caseName;
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