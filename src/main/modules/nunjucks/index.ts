import config from 'config';
import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import { Form } from '../../components/form/form';
import { FormFields, FormInput } from '../../definitions/form';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    const govUkFrontendPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'node_modules',
      'govuk-frontend',
    );
    const nunEnv = nunjucks.configure(
      [path.join(__dirname, '..', '..', 'views'), govUkFrontendPath],
      {
        autoescape: true,
        watch: this.developmentMode,
        express: app,
      },
    );

    nunEnv.addGlobal(
      'welshEnabled',
      process.env.FT_WELSH === 'true' ||
        config.get('featureFlags.welsh') === 'true',
    );

    nunEnv.addGlobal('getContent', function (prop: any | string): string {
      return typeof prop === 'function' ? prop(this.ctx) : prop;
    });

    nunEnv.addGlobal('getError', function (fieldName: string):
      | { text?: string; fieldName?: string }
      | boolean {
      const { form, sessionErrors, errors } = this.ctx;

      const hasMoreThanTwoFields = new Form(form).getFieldNames().size >= 2;
      if (!sessionErrors?.length || !hasMoreThanTwoFields) {
        return false;
      }

      const fieldError = sessionErrors.find(
        (error: any) => error.propertyName === fieldName,
      );
      if (!fieldError) {
        return false;
      }
      return {
        text: errors[fieldName][fieldError.errorType],
        fieldName: fieldError['fieldName'],
      };
    });

    nunEnv.addGlobal('getErrors', function (items: FormFields[]): {
      text?: string
      href?: string
    }[] {
      return Object.entries(items)
        .flatMap(([fieldName, field]) => {
          const error = this.env.globals.getError.call(this, fieldName) as {
            text?: string
            fieldName?: string
          };
          if (error && error?.text) {
            return {
              text: error.text,
              href: `#${field.id}${
                error.fieldName ? '-' + error.fieldName : ''
              }`,
            };
          }
          return;
        })
        .filter((e) => e);
    });

    nunEnv.addGlobal(
      'formItems',
      function (
        items: FormInput[],
        userAnswer: string | Record<string, string>,
      ) {
        return items.map((i: FormInput) => ({
          id: i.id,
          label: this.env.globals.getContent.call(this, i.label),
          text: this.env.globals.getContent.call(this, i.label),
          name: i.name,
          classes: i.classes,
          value:
            i.value ??
            (userAnswer as any)?.[i.name as string] ??
            (userAnswer as string),
          attributes: i.attributes,
          checked:
            i.selected ??
            (userAnswer as any)?.[i.name as string]?.includes(
              i.value as string,
            ) ??
            i.value === userAnswer,
          hint: i.hint && {
            html: this.env.globals.getContent.call(this, i.hint),
          },
          conditional: ((): { html: any | undefined } => {
            if (i.conditionalText) {
              return {
                html: this.env.globals.getContent.call(this, i.conditionalText),
              };
            } else if (i.subFields) {
              return {
                html: nunEnv.render(
                  `${__dirname}/../../views/form/fields.njk`,
                  {
                    ...this.ctx,
                    form: { fields: i.subFields },
                  },
                ),
              };
            } else {
              return undefined;
            }
          })(),
        }));
      },
    );

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      nunEnv.addGlobal('currentUrl', req.url);
      next();
    });
  }
}
