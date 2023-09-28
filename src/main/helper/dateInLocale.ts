import { retrieveCurrentLocale } from '../controllers/helpers/ApplicationTableRecordTranslationHelper';

// returns Welsh or English representation of a Date instance in long format based on parm in url
export const dateInLocale = (dateToTransform: Date, url: string): string => {
  return new Date(dateToTransform).toLocaleDateString(retrieveCurrentLocale(url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Converts datestring to a date in the locale, returns the original string if date invalid / not parsed
// '2022-03-25', 'url?lng=cy' => '25 Mawrth 2022',
// 'unknown string', 'url' => 'unknown string'
export const datesStringToDateInLocale = (dateString: string, url: string): string => {
  if (isNaN(Date.parse(dateString)) === false) {
    return dateInLocale(new Date(dateString), url);
  }
  return dateString;
};
