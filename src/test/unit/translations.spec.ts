import fs from 'fs';
import path from 'path';

const englishDirectory = '../../main/resources/locales/en/translation/';
const welshDirectory = '../../main/resources/locales/cy/translation/';

const englishTranslationFiles = fs.readdirSync(path.resolve(__dirname, englishDirectory));

const welshTranslationFiles = fs.readdirSync(path.resolve(__dirname, welshDirectory));

describe('Read all translation files', () => {
  it('should have equal number of translation files', () => {
    expect(englishTranslationFiles).toHaveLength(welshTranslationFiles.length);
  });

  it('should have equal keys in welsh and england files', () => {
    const unmatchedArray = [];
    let data = '';
    for (const file of englishTranslationFiles) {
      const englishFile = fs.readFileSync(path.resolve(__dirname, englishDirectory + file), 'utf-8');
      const welshFile = fs.readFileSync(path.resolve(__dirname, welshDirectory + file), 'utf-8');

      const englishContents = JSON.parse(englishFile);
      const welshContents = JSON.parse(welshFile);

      const englandKeys = [];
      const welshKeys = [];

      for (const k in englishContents) {
        englandKeys.push(k);
      }

      for (const k in welshContents) {
        welshKeys.push(k);
      }

      for (let index = 0; index < englandKeys.length; index++) {
        if (welshKeys.includes(englandKeys[index])) {
          continue;
        }
        unmatchedArray.push(englandKeys[index]);
        data = data.concat(` File: '${file}' Missing key: '${englandKeys[index]}'\n`);
      }
      fs.writeFile('missingTranslationKeys.txt', data, err => {
        if (err) {
          console.log(err);
        }
      });
    }
    expect(unmatchedArray).toHaveLength(0);
  });
});
