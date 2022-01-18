import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { Application } from 'express';
import * as fs from 'fs';
import path from 'path';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class Container {
  public enableFor(app: Application): void {
    const jsonObject: { [key: string]: any } = {};

    const files = fs.readdirSync(path.join(__dirname, '../../controllers'), {
      withFileTypes: true,
    });
    files
      .filter((f) => f.isFile())
      .map((f: fs.Dirent) => f.name)
      .forEach((f: string) => {
        const controllerName = f.slice(0, -3);
        const registerName =
          controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
        const clazz = require('../../controllers/' + controllerName);
        jsonObject[registerName] = asClass(clazz.default);
      });
    jsonObject['logger'] = asValue(logger);
    app.locals.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    }).register(jsonObject);
  }
}
