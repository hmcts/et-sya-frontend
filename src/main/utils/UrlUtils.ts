import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class UrlUtils {
  /**
   * returns all the parameters of the given url in a string array.
   * @param url string value of the url to get all the params.
   */
  public static getRequestParamsFromUrl(url: string): string[] {
    if (StringUtils.isBlank(url) || !url.includes(DefaultValues.STRING_QUESTION_MARK)) {
      return [];
    }

    const queryString = url.split(DefaultValues.STRING_QUESTION_MARK)[1];

    if (StringUtils.isBlank(queryString)) {
      return [];
    }

    return queryString.split(DefaultValues.STRING_AMPERSAND).filter(p => StringUtils.isNotBlank(p));
  }

  /**
   * Removes parameter from the given url. For example if url is
   * "https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy" and parameter is
   * "redirect=clearSelection" returns "https://localhost:3003/employers-contract-claim?lng=cy".
   * Please be careful, if parameter to be removed is the first parameter if there is another parameter,
   * then makes that parameter as the first parameter and replaces ampersand (&) with (?).
   * If parameter to be removed is not the first parameter then it simply removes it.
   * @param url the string value in http url format that has the parameter which needs to be removed
   * @param parameter is the parameter that needs to be removed. It should be in the format like redirect=clearSelection
   *                  name of the parameter, equals sign and value of the parameter.
   */
  public static removeParameterFromUrl(url: string, parameter: string): string {
    if (
      StringUtils.isBlank(url) ||
      StringUtils.isBlank(parameter) ||
      !url.includes(DefaultValues.STRING_QUESTION_MARK)
    ) {
      return url;
    }
    if (url.includes(DefaultValues.STRING_QUESTION_MARK + parameter)) {
      url = url.replace(DefaultValues.STRING_QUESTION_MARK + parameter, DefaultValues.STRING_EMPTY);
      if (url.includes(DefaultValues.STRING_AMPERSAND)) {
        url = StringUtils.replaceFirstOccurrence(
          url,
          DefaultValues.STRING_AMPERSAND,
          DefaultValues.STRING_QUESTION_MARK
        );
      }
    }
    if (url.includes(DefaultValues.STRING_AMPERSAND + parameter)) {
      url = StringUtils.removeFirstOccurrence(url, DefaultValues.STRING_AMPERSAND + parameter);
    }
    return url;
  }
}
