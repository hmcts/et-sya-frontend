import * as path from 'path';

import express from 'express';
import nunjucks from 'nunjucks';

import { AppRequest } from '../../definitions/appRequest';
import { FormError, FormField, FormFields, FormInput } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { dateInLocale, dateTimeInLocale, datesStringToDateInLocale } from '../../helper/dateInLocale';

import createFilters from './njkFilters';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    const govUkFrontendPath = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'govuk-frontend', 'dist');
    const nunEnv = nunjucks.configure([path.join(__dirname, '..', '..', 'views'), govUkFrontendPath], {
      autoescape: true,
      watch: app.locals.developmentMode,
      express: app,
    });
    createFilters(nunEnv);

    nunEnv.addGlobal('getContent', function (prop: ((param: string) => string) | string): string {
      return typeof prop === 'function' ? prop(this.ctx) : prop;
    });

    nunEnv.addGlobal(
      'getContentSafe',
      function (prop: ((param: string) => string) | string): nunjucks.runtime.SafeString {
        return new nunjucks.runtime.SafeString(this.env.globals.getContent.call(this, prop));
      }
    );

    nunEnv.addGlobal('getError', function (fieldName: string): { text?: string; fieldName?: string } | boolean {
      const { sessionErrors, errors } = this.ctx;

      if (!sessionErrors?.length) {
        return false;
      }

      const fieldError = sessionErrors.find((error: FormError) => error.propertyName === fieldName);
      if (!fieldError) {
        return false;
      }

      return { text: errors[fieldName][fieldError.errorType] };
    });

    nunEnv.addGlobal('getErrors', function (items: FormFields[]): {
      text?: string;
      href?: string;
    }[] {
      return Object.entries(items)
        .flatMap(([fieldName, field]) => {
          const errors = [];

          if (field.values) {
            for (const value of field.values as unknown as FormField[]) {
              if (value.subFields) {
                const subFields = Object.entries(value.subFields);
                subFields.flatMap(([subFieldName, subField]) => {
                  const subFieldError = this.env.globals.getError.call(this, subFieldName) as {
                    text?: string;
                    fieldName?: string;
                  };
                  if (subFieldError && subFieldError?.text) {
                    errors.push({
                      text: subFieldError.text,
                      href: `#${subField.id}`,
                    });
                  }
                });
              }
            }
          }

          const error = this.env.globals.getError.call(this, fieldName) as {
            text?: string;
            fieldName?: string;
          };
          if (error && error?.text) {
            errors.push({
              text: error.text,
              href: `#${field.id}`,
            });
          }
          return errors;
        })
        .filter(e => e);
    });

    nunEnv.addGlobal(
      'formItems',
      function (items: FormInput[], userAnswer: string | Record<string, string> | string[]) {
        return items.map((i: FormInput) => ({
          id: i.id,
          label: this.env.globals.getContentSafe.call(this, i.label),
          text: this.env.globals.getContentSafe.call(this, i.label),
          name: i.name,
          classes: i.classes,
          value: i.value ?? (userAnswer as AnyRecord)?.[i.name as string] ?? (userAnswer as string),
          attributes: i.attributes,
          checked:
            i.selected ??
            (userAnswer as AnyRecord)?.[i.name as string]?.includes(i.value as string) ??
            Array.isArray(userAnswer)
              ? (userAnswer as string[]).includes(i.value as string)
              : i.value === userAnswer,
          selected: i.value === userAnswer,
          hint: i.hint && {
            html: this.env.globals.getContent.call(this, i.hint),
          },
          divider: this.env.globals.currentUrl.includes('lng=cy') ? i.divider && 'neu' : i.divider && 'or',
          behaviour: i.exclusive && 'exclusive',
          conditional: ((): { html: string | undefined } => {
            let innerHtml = '';
            if (i.subFields) {
              innerHtml =
                innerHtml +
                nunEnv.render(`${__dirname}/../../views/form/fields.njk`, {
                  ...this.ctx,
                  form: { fields: i.subFields },
                });
            }
            if (i.conditionalText) {
              innerHtml = innerHtml + this.env.globals.getContent.call(this, i.conditionalText);
            }
            return {
              html: innerHtml,
            };
          })(),
        }));
      }
    );

    app.use((req: AppRequest, res, next) => {
      nunEnv.addGlobal('isLoggedIn', !!res.locals.isLoggedIn);
      next();
    });

    app.use((req, res, next) => {
      res.locals.host = req.headers['x-forwarded-host'] || req.hostname;
      res.locals.pagePath = req.path;
      nunEnv.addGlobal('currentUrl', req.url);
      nunEnv.addGlobal('currentHost', req?.headers?.host?.toLowerCase());
      nunEnv.addGlobal('dateToLocale', (dateToTransform: Date) => dateInLocale(dateToTransform, req.url));
      nunEnv.addGlobal('dateTimeInLocale', (dateToTransform: Date) => dateTimeInLocale(dateToTransform, req.url));
      nunEnv.addGlobal('dateStringToLocale', (dateToTransform: string) =>
        datesStringToDateInLocale(dateToTransform, req.url)
      );
      nunEnv.addGlobal('govukRebrand', true);
      next();
    });
  }
}
