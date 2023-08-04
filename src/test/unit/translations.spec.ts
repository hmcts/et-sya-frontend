import fs from 'fs';
import path from 'path';

import { getLogger } from '../../main/logger';

const englishDirectory = '../../main/resources/locales/en/translation/';
const welshDirectory = '../../main/resources/locales/cy/translation/';

const englishTranslationFiles = fs.readdirSync(path.resolve(__dirname, englishDirectory));

const welshTranslationFiles = fs.readdirSync(path.resolve(__dirname, welshDirectory));

const logger = getLogger('translations');

const findMissingKeys = function (
  original: Record<string, unknown>,
  toCheck: Record<string, unknown>,
  previousPath = '',
  output: string[] = []
) {
  for (const key in original) {
    const currentPath = previousPath ? `${previousPath} -> ${key}` : key;

    if (typeof original[key] === 'object') {
      if (toCheck !== undefined) {
        findMissingKeys(
          original[key] as Record<string, unknown>,
          toCheck[key] as Record<string, unknown>,
          currentPath,
          output
        );
      } else {
        findMissingKeys(original[key] as Record<string, unknown>, {}, currentPath, output);
      }
    } else {
      if (toCheck === undefined || toCheck[key] === undefined) {
        output.push(`No match for: ${currentPath}`);
      }
    }
  }
  return output;
};

describe('Check missing keys in translation files', () => {
  it('There should not be any missing translation files for welsh translations', () => {
    const missingFiles = englishTranslationFiles.filter(x => !welshTranslationFiles.includes(x));
    expect(missingFiles).toEqual([]);
  });

  it('There should not be any missing translation files for english translations', () => {
    const missingFiles = welshTranslationFiles.filter(x => !englishTranslationFiles.includes(x));
    expect(missingFiles).toEqual([]);
  });

  test.each(welshTranslationFiles)('Check english translation file %s has no missing keys', file => {
    const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), 'utf-8');
    const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');
    const englishContents = JSON.parse(englishFile) as Record<string, unknown>;
    const welshContents = JSON.parse(welshFile) as Record<string, unknown>;

    expect(findMissingKeys(welshContents, englishContents)).toEqual([]);
  });

  test.each(englishTranslationFiles)('Check welsh translation file %s has no missing keys', file => {
    const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), 'utf-8');
    const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');
    const englishContents = JSON.parse(englishFile);
    const welshContents = JSON.parse(welshFile);

    expect(findMissingKeys(englishContents, welshContents)).toEqual([]);
  });

  test.each(englishTranslationFiles)('Check welsh translation file %s has no unfinished translations', file => {
    const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');
    const welshContents = JSON.parse(welshFile);

    checkWelshTranlationFile(welshContents, file.replace(/\.json/, ''));
  });

  function checkWelshTranlationFile(obj: { [index: string]: unknown }, full_key: string) {
    for (const k in obj) {
      if (typeof obj[k] === 'string') {
        const val: string = obj[k] as string;
        if (
          val.includes('Welsh Translation required') ||
          val.includes('Requires Update') ||
          val.includes('Update Required') ||
          val === ''
        ) {
          logger.warn(`${full_key}.${k} Does not have welsh translation`);
        }
      } else {
        if (typeof obj[k] === 'object') {
          const val: { [index: string]: unknown } = obj[k] as { [index: string]: unknown };
          checkWelshTranlationFile(val, `${full_key}.${k}`);
        }
      }
    }
  }

  test.each(englishTranslationFiles)('Check welsh translation file %s has no unfinished translations', file => {
    const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');
    const welshContents = JSON.parse(welshFile);

    checkWelshTranlationFile(welshContents, file.replace(/\.json/, ''));
  });
});
