import * as path from 'path';

import express from 'express';
import nunjucks from 'nunjucks';

import { AppRequest } from '../../definitions/appRequest';
import { FormError, FormField, FormFields, FormInput } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { dateInLocale, dateTimeInLocale, datesStringToDateInLocale } from '../../helper/dateInLocale';

import createFilters from './njkFilters';
const ERROR_VALUE_SEPARATOR = '|';
const PRIMARY_ERROR_VALUE_PLACEHOLDERS = ['{{errorValue}}'];
const SECONDARY_ERROR_VALUE_PLACEHOLDERS = ['{{errorValue2}}'];

const replacePlaceholders = (template: string, placeholders: string[], value: string): string => {
  return placeholders.reduce((resolvedTemplate, placeholder) => {
    return resolvedTemplate.split(placeholder).join(value);
  }, template);
};

/**
 * Resolves every session error attached to a given field into its
 * translated, placeholder-interpolated display message(s).
 */
export const resolveFieldErrorMessages = (
  sessionErrors: FormError[] | undefined,
  errors: AnyRecord,
  fieldName: string,
  defaultErrorValue?: string | number
): string[] => {
  if (!sessionErrors?.length || !errors?.[fieldName]) {
    return [];
  }

  return sessionErrors
    .filter((error: FormError) => error.propertyName === fieldName)
    .map((fieldError: FormError) => {
      const fieldErrorTranslations = errors[fieldName];
      const template = fieldErrorTranslations[fieldError.errorType];
      if (typeof template !== 'string') {
        return null;
      }
      const placeholderValue = fieldError.fieldName ?? defaultErrorValue;
      if (placeholderValue === undefined || placeholderValue === null) {
        return template;
      }
      let rawPrimaryValue = String(placeholderValue);
      let secondaryValue = fieldError.fieldName2;
      if (secondaryValue === undefined) {
        const splitValues = rawPrimaryValue.split(ERROR_VALUE_SEPARATOR);
        if (splitValues.length > 1) {
          rawPrimaryValue = splitValues[0];
          secondaryValue = splitValues.slice(1).join(ERROR_VALUE_SEPARATOR);
        }
      }
      const primaryValue = fieldErrorTranslations.invalidFieldLabels?.[rawPrimaryValue] ?? rawPrimaryValue;
      let resolvedMessage = replacePlaceholders(template, PRIMARY_ERROR_VALUE_PLACEHOLDERS, primaryValue);
      resolvedMessage = replacePlaceholders(resolvedMessage, SECONDARY_ERROR_VALUE_PLACEHOLDERS, secondaryValue ?? '');
      return resolvedMessage;
    })
    .filter((text): text is string => !!text);
};

export const formatInlineFieldError = (fieldMessages: string[]): { text?: string; html?: string } | null => {
  if (!fieldMessages.length) {
    return null;
  }

  if (fieldMessages.length > 1) {
    return { html: fieldMessages.join('<br>') };
  }

  return { text: fieldMessages[0] };
};

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

    nunEnv.addGlobal('getError', function (fieldName: string): { text?: string; html?: string } | boolean {
      const { sessionErrors, errors } = this.ctx;
      const defaultErrorValue = this.ctx.errorValue;
      const fieldMessages = resolveFieldErrorMessages(sessionErrors, errors, fieldName, defaultErrorValue);
      const formattedError = formatInlineFieldError(fieldMessages);
      return formattedError ?? false;
    });

    nunEnv.addGlobal('getErrors', function (items: FormFields): { text?: string; href?: string }[] {
      const { sessionErrors, errors } = this.ctx;
      const defaultErrorValue = this.ctx.errorValue;

      return Object.entries(items)
        .flatMap(([fieldName, field]) => {
          const fieldErrors: { text: string; href: string }[] = [];

          if (field.values) {
            for (const value of field.values as unknown as FormField[]) {
              if (value.subFields) {
                Object.entries(value.subFields).forEach(([subFieldName, subField]) => {
                  resolveFieldErrorMessages(sessionErrors, errors, subFieldName, defaultErrorValue).forEach(message => {
                    fieldErrors.push({ text: message, href: `#${subField.id}` });
                  });
                });
              }
            }
          }
          resolveFieldErrorMessages(sessionErrors, errors, fieldName, defaultErrorValue).forEach(message => {
            fieldErrors.push({ text: message, href: `#${field.id}` });
          });

          return fieldErrors;
        })
        .filter(Boolean);
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
          divider: this.ctx.currentUrl?.includes('lng=cy') ? i.divider && 'neu' : i.divider && 'or',
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
      res.locals.isLoggedIn = !!res.locals.isLoggedIn;
      next();
    });

    app.use((req, res, next) => {
      res.locals.host = req.headers['x-forwarded-host'] || req.hostname;
      res.locals.pagePath = req.path;
      res.locals.currentUrl = req.url;
      res.locals.currentHost = req?.headers?.host?.toLowerCase();
      res.locals.dateToLocale = (dateToTransform: Date) => dateInLocale(dateToTransform, req.url);
      res.locals.dateTimeInLocale = (dateToTransform: Date) => dateTimeInLocale(dateToTransform, req.url);
      res.locals.dateStringToLocale = (dateToTransform: string) => datesStringToDateInLocale(dateToTransform, req.url);
      next();
    });
  }
}
