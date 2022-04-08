const supportedBrowsers = {
  // edge: {
  //     edge: {
  //         browserName: 'MicrosoftEdge',
  //         "ms:edgeChromium": true,
  //         platformName: 'macOS 11.00',
  //         ignoreZoomSetting: true,
  //         nativeEvents: false,
  //         ignoreProtectedModeSettings: true,
  //         browserVersion: 'latest',
  //         'sauce:options': {
  //             name: 'Edge_LATEST_ET'
  //         }
  //     }
  // },
  chrome: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_CHROME_LATEST_ET',
      },
    },
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: 'macOS 10.15',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_CHROME_LATEST_ET',
      },
    },
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: 'Windows 10',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_FIREFOX_LATEST_ET',
      },
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: 'macOS 10.15',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_FIREFOX_LATEST_ET',
      },
    },
  },
  safari: {
    safari_mac_latest: {
      browserName: 'safari',
      platformName: 'macOS 11.00',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_SAFARI_LATEST_ET',
        seleniumVersion: '3.141.59',
      },
    },
  },
};

module.exports = supportedBrowsers;
