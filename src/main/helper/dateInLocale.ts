import { retrieveCurrentLocale } from '../controllers/helpers/ApplicationTableRecordTranslationHelper';

export const dateInLocale = (dateToTransform: Date, url: string): string => {
  return new Date(dateToTransform).toLocaleDateString(retrieveCurrentLocale(url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// '2022-03-25', 'url?lng=cy' => '25 Mawrth 2022',
// 'unknown string', 'url' => 'unknown string'
export const datesStringToDateInLocale = (dateString: string, url: string): string => {
  if (!dateString) {
    return dateString;
  }
  if (isNaN(Date.parse(dateString)) === false) {
    return dateInLocale(new Date(dateString), url);
  }
  return dateString;
};
