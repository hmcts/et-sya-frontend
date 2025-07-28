import { retrieveCurrentLocale } from '../controllers/helpers/ApplicationTableRecordTranslationHelper';
import { languages } from '../definitions/constants';

// returns Welsh or English representation of a Date instance in long format based on param in url
export const dateInLocale = (dateToTransform: Date, url: string): string => {
  const date = new Date(dateToTransform);

  if (isNaN(date.getTime())) {
    return url.includes(languages.WELSH_URL_PARAMETER) ? 'Dyddiad ddim yn ddilys' : 'Invalid Date';
  }

  return date.toLocaleDateString(retrieveCurrentLocale(url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const dateTimeInLocale = (dateToTransform: Date, url: string): string => {
  const date = new Date(dateToTransform);

  if (isNaN(date.getTime())) {
    return url.includes(languages.WELSH_URL_PARAMETER) ? 'Dyddiad ddim yn ddilys' : 'Invalid Date';
  }

  const locale = retrieveCurrentLocale(url);
  const formattedDate = date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
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
