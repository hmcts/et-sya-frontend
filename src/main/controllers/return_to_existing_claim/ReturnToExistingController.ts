import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';

export default class ReturnToExistingController {
  private readonly form: Form;

  constructor(private readonly formContent: FormContent) {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const formData = this.form.getParsedBody(req.body, this.formContent.fields);   

    let sessionErrors = this.form.getErrors(formData);
    
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

    res.render('return-to-claim', {
      ...req.t('common', { returnObjects: true }),
      ...req.t('return-to-existing', { returnObjects: true }),
      form: this.formContent,
      sessionErrors,
     
    });
  }
}