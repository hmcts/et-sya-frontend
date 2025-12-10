import _ from 'lodash';

import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class UrlUtils {
  /**
   * returns all the parameters of the given url in a string array.
   * @param url string value of the url to get all the params.
   */
  public static getRequestParamsFromUrl(url: string): string[] {
    if (StringUtils.isBlank(url)) {
      return [];
    }
    if (url.indexOf(DefaultValues.STRING_QUESTION_MARK) === -1) {
      return [];
    }
    const params: string[] = [];
    let clonedUrl: string = _.cloneDeep(url);
    clonedUrl = clonedUrl.substring(clonedUrl.indexOf(DefaultValues.STRING_QUESTION_MARK));
    while (StringUtils.isNotBlank(clonedUrl)) {
      let indexOfAmpersand: number = clonedUrl.indexOf(DefaultValues.STRING_AMPERSAND);
      if (indexOfAmpersand === -1) {
        indexOfAmpersand = clonedUrl.length;
      }
      const parameter: string = clonedUrl.substring(1, indexOfAmpersand);
      params.push(parameter);
      clonedUrl = this.removeParameterFromUrl(clonedUrl, parameter);
    }
    return params;
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
    if (StringUtils.isBlank(url) || StringUtils.isBlank(parameter)) {
      return url;
    }
    if (url.indexOf(DefaultValues.STRING_QUESTION_MARK) === -1) {
      return url;
    }
    if (url.indexOf(DefaultValues.STRING_QUESTION_MARK + parameter) !== -1) {
      url = url.replace(DefaultValues.STRING_QUESTION_MARK + parameter, DefaultValues.STRING_EMPTY);
      if (url.indexOf(DefaultValues.STRING_AMPERSAND) !== -1) {
        url = StringUtils.replaceFirstOccurrence(
          url,
          DefaultValues.STRING_AMPERSAND,
          DefaultValues.STRING_QUESTION_MARK
        );
      }
    }
    if (url.indexOf(DefaultValues.STRING_AMPERSAND + parameter) !== -1) {
      url = StringUtils.removeFirstOccurrence(url, DefaultValues.STRING_AMPERSAND + parameter);
    }
    return url;
  }
}
