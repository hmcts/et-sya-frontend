import fs from 'fs';
import path from 'path';

const englishDirectory = '../../main/resources/locales/en/translation/';
const welshDirectory = '../../main/resources/locales/cy/translation/';

const englishTranslationFiles = fs.readdirSync(path.resolve(__dirname, englishDirectory));

const welshTranslationFiles = fs.readdirSync(path.resolve(__dirname, welshDirectory));

const findMissingKeys = function (
  original: Record<string, unknown>,
  toCheck: Record<string, unknown>,
  previousPath = '',
  output: string[] = []
) {
  for (const key in original) {

    const currentPath = previousPath ? `${previousPath}.${key}` : key;

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
  it('should have equal number of translation files', () => {
    expect(englishTranslationFiles).toHaveLength(welshTranslationFiles.length);
  });

  test.each(welshTranslationFiles)('Check english translation file %s has no missing keys', file => {
    const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), 'utf-8');
    const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');
    const englishContents = JSON.parse(englishFile) as Record<string, unknown>;
    const welshContents = JSON.parse(welshFile) as Record<string, unknown>;

    expect(findMissingKeys(welshContents, englishContents)).toMatchObject([]);
  });

  test.each(englishTranslationFiles)('Check welsh translation file %s has no missing keys', file => {
    const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), 'utf-8');
    const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');
    const englishContents = JSON.parse(englishFile);
    const welshContents = JSON.parse(welshFile);

    expect(findMissingKeys(englishContents, welshContents)).toMatchObject([]);
  });
});
