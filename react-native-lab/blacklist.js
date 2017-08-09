'use strict';

const {
  createBlacklist,
} = require(`./react-native/node_modules/metro-bundler`);
const path = require('path');

const sharedLibraryBlacklist = [
  /node_modules\/@expo\/ex-navigation\/.*/,
  /libraries\/ex-navigation\/lib\/.*/,
  /libraries\/ex-navigation\/package\.json/,
  /libraries\/ex-navigation\/example\/.*/,
  /node_modules\/react-native-sortable-list-view\/.*/,
  /node_modules\/react-native-swipe-actions\/.*/,
  /node_modules\/react-native-action-sheet\/.*/,
  /node_modules\/@expo\/react-native-touchable-native-feedback-safe\/.*/,
  /node_modules\/@expo\/sentry-utils\/.*/,
  /node_modules\/@expo\/with-custom-font\/.*/,
  /node_modules\/@expo\/vector-icons\/.*/,
  /node_modules\/@expo\/samples\/.*/,
];

module.exports = {
  blacklistForApp(appName, sdkVersion, extra, skip = []) {
    const universePath = path.join(__dirname, '..');

    let regexes = [
      // Ignore any app that isn't "appName"
      new RegExp(`^${escapeRegExp(universePath)}\/(apps\/(?!${appName})).*$`),
      // Ignore anything in the Exponent, dev, server, and tools folders
      new RegExp(
        `^${escapeRegExp(universePath)}\/(dev|exponent|server|tools)\/.*`
      ),
      new RegExp(
        `^${escapeRegExp(
          universePath
        )}\/apps\/.*\/node_modules\/(react-native|react)\/.*`
      ),
      new RegExp(
        `^${escapeRegExp(
          universePath
        )}\/libraries\/.*\/node_modules\/(react-native|react)\/.*`
      ),
      ...sharedLibraryBlacklist,
    ];

    regexes.forEach((item, i) => {
      skip.forEach(str => {
        if (str.match(item)) {
          regexes.splice(i, 1);
        }
      });
    });

    regexes = [...regexes, ...extra];

    return createBlacklist(regexes);
  },
  expoBlacklist(extra) {
    const universePath = path.join(__dirname, '..');

    return createBlacklist([
      new RegExp(`^${escapeRegExp(universePath)}\/dev\/.*$`),
      new RegExp(
        `^${escapeRegExp(
          universePath
        )}\/expo\/(android|ios|tools|versioned-react-native|android-shell-app|exponent-view-template)\/.*`
      ),
      new RegExp(
        `^${escapeRegExp(
          universePath
        )}\/expo\/.*\/node_modules\/(react-native|react)\/.*`
      ),
      new RegExp(`^${escapeRegExp(universePath)}\/(apps|server|tools)\/.*`),
      new RegExp(
        `^${escapeRegExp(
          universePath
        )}\/dev\/.*\/node_modules\/(react-native|react)\/.*`
      ),
      new RegExp(
        `^${escapeRegExp(
          universePath
        )}\/libraries\/.*\/node_modules\/(react-native|react)\/.*`
      ),
      ...sharedLibraryBlacklist,
      ...extra,
    ]);
  },
  get exponentBlacklist() {
    console.warn('Use expoBlacklist instead of exponentBlacklist');
    return this.expoBlacklist;
  },
};

function escapeRegExp(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
