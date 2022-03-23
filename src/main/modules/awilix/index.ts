import * as fs from 'fs';
import path from 'path';

import { InjectionMode, NameAndRegistrationPair, asClass, asValue, createContainer } from 'awilix';
import { Application } from 'express';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class Container {
  public enableFor(app: Application): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonObject: NameAndRegistrationPair<any> = {};
    const defaultControllerPath = '../../controllers';
    const IGNORE_LIST = ['helpers.ts'];

    const files = fs.readdirSync(path.join(__dirname, defaultControllerPath), {
      withFileTypes: true,
    });
    files
      .filter(f => !IGNORE_LIST.includes(f.name) && f.isFile())
      .forEach(f => {
        const controllerName = f.name.slice(0, -3);
        const registerName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
        const clazz = require(`${defaultControllerPath}/` + controllerName);
        const asClazz = asClass(clazz.default);
        jsonObject[registerName] = asClazz;
      });
    jsonObject['logger'] = asValue(logger);
    app.locals.container = createContainer({ injectionMode: InjectionMode.CLASSIC }).register(jsonObject);
  }
}
