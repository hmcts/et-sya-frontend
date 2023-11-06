import { retrieveCurrentLocale } from '../controllers/helpers/ApplicationTableRecordTranslationHelper';

// returns Welsh or English representation of a Date instance in long format based on param in url
export const dateInLocale = (dateToTransform: Date, url: string): string => {
  return new Date(dateToTransform).toLocaleDateString(retrieveCurrentLocale(url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Converts datestring to correct language (Welsh or English)
// Checks if the string can be parsed into a valid date instance,
// if not will return original string.
// '2022-03-25', 'url?lng=cy' => '25 Mawrth 2022',
// 'unknown string', 'url?lng=cy' => 'unknown string'
export const datesStringToDateInLocale = (dateString: string, url: string): string => {
  if (isNaN(Date.parse(dateString)) === false) {
    return dateInLocale(new Date(dateString), url);
  }
  return dateString;
};
