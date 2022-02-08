import * as fs from 'fs';
import path, { extname } from 'path';

import { InjectionMode, NameAndRegistrationPair, asClass, asValue, createContainer } from 'awilix';
import { Application } from 'express';

import { AnyRecord } from '../../definitions/util-types';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');
const ext = extname(__filename);
const defaultControllerPath = '../../controllers';
const IGNORE_LIST = ['helpers.ts'];

export class Container {
  public enableFor(app: Application): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonObject: NameAndRegistrationPair<any> = {};

    const files = fs.readdirSync(path.join(__dirname, defaultControllerPath), {
      withFileTypes: true,
    });
    files
      .filter(f => !IGNORE_LIST.includes(f.name))
      .forEach(f => {
        if (f.isDirectory()) {
          const dir = `${defaultControllerPath}/${f.name}`;
          const dirFiles = fs.readdirSync(path.join(__dirname, dir), {
            withFileTypes: true,
          });
          dirFiles
            .filter(df => df.isFile())
            .map(df => df.name)
            .forEach((df: string) => {
              const contentFile = `content${ext}`;
              if (df === contentFile) {
                const dirPath = path.join(__dirname, `${dir}/${contentFile}`);
                const content = fs.existsSync(dirPath) ? require(dirPath) : {};
                Object.entries(content).forEach(([name, field]) => {
                  jsonObject[name] = asValue(field);
                });
                return;
              }
              registerController(df, jsonObject, dir);
            });
        } else {
          registerController(f.name, jsonObject, defaultControllerPath);
        }
      });
    jsonObject['logger'] = asValue(logger);
    app.locals.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    }).register(jsonObject);
  }
}

const registerController = (name: string, jsonObject: AnyRecord, controllerPath: string) => {
  const cp = controllerPath.endsWith('/') ? controllerPath : `${controllerPath}/`;
  const controllerName = name.slice(0, -3);
  const registerName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
  const clazz = require(cp + controllerName);
  const asClazz = asClass(clazz.default);
  jsonObject[registerName] = asClazz;
};
