/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Note: This is a fork of the fb-specific transform.js
 *
 * @flow
 */
'use strict';

/**
 * [Expo] This transformer was based on React Native's transformer with the
 * following changes:
 *   - Makes the packager use react-native-lab's copy of react-native
 *   - Rewrites the paths of this module's dependencies so we load the
 *     dependencies from react-native-lab's copy of react-native, to simulate
 *     if we hadn't forked the transformer at all
 */

const babel = require('./react-native/node_modules/babel-core');
const crypto = require('crypto');
const externalHelpersPlugin = require('./react-native/node_modules/babel-plugin-external-helpers');
const fs = require('fs');
const generate = require('./react-native/node_modules/babel-generator').default;
const inlineRequiresPlugin = require('./react-native/node_modules/babel-preset-fbjs/plugins/inline-requires');
const makeHMRConfig = require('./react-native/node_modules/babel-preset-react-native/configs/hmr');
const path = require('path');
const resolvePlugins = require('./react-native/node_modules/babel-preset-react-native/lib/resolvePlugins');

const {
  compactMapping,
} = require('./react-native/node_modules/metro-bundler/build/Bundler/source-map'); // Chnage in SDK 20

import type { Plugins as BabelPlugins } from './react-native/node_modules/babel-core';
import type {
  Transformer,
  TransformOptions,
} from './react-native/node_modules/metro-bundler/build/JSTransformer/worker'; // Change in SDK 20

const cacheKeyParts = [
  fs.readFileSync(__filename),
  require('./react-native/node_modules/babel-plugin-external-helpers/package.json')
    .version,
  require('./react-native/node_modules/babel-preset-fbjs/package.json').version,
  require('./react-native/node_modules/babel-preset-react-native/package.json')
    .version,
];

/**
 * Given a filename and options, build a Babel
 * config object with the appropriate plugins.
 */
function buildBabelConfig(filename, options) {
  // [Expo] We create the Babel configuration here instead of loading babelrc
  const babelRC = {
    presets: [
      require('babel-preset-react-native-stage-0/decorator-support'),
      buildModuleResolverPreset(),
    ],
    plugins: [],
  };

  const extraConfig = {
    code: false,
    filename,
  };

  let config = Object.assign({}, babelRC, extraConfig);

  // Add extra plugins
  const extraPlugins = [externalHelpersPlugin];

  var inlineRequires = options.inlineRequires;
  var blacklist = typeof inlineRequires === 'object'
    ? inlineRequires.blacklist
    : null;
  if (inlineRequires && !(blacklist && filename in blacklist)) {
    extraPlugins.push(inlineRequiresPlugin);
  }

  config.plugins = extraPlugins.concat(config.plugins);

  if (options.hot) {
    const hmrConfig = makeHMRConfig(options, filename);
    config = Object.assign({}, config, hmrConfig);
  }

  return Object.assign({}, babelRC, config);
}

type Params = {
  filename: string,
  options: TransformOptions,
  plugins?: BabelPlugins,
  src: string,
};

function transform({ filename, options, src }: Params) {
  options = options || {};

  const OLD_BABEL_ENV = process.env.BABEL_ENV;
  process.env.BABEL_ENV = options.dev ? 'development' : 'production';

  try {
    const babelConfig = buildBabelConfig(filename, options);
    const { ast, ignored } = babel.transform(src, babelConfig);

    if (ignored) {
      return {
        ast: null,
        code: src,
        filename,
        map: null,
      };
    } else {
      const result = generate(
        ast,
        {
          comments: false,
          compact: false,
          filename,
          sourceFileName: filename,
          sourceMaps: true,
        },
        src
      );

      return {
        ast,
        code: result.code,
        filename,
        map: options.generateSourceMaps
          ? result.map
          : result.rawMappings.map(compactMapping),
      };
    }
  } finally {
    process.env.BABEL_ENV = OLD_BABEL_ENV;
  }
}

function getCacheKey() {
  var key = crypto.createHash('md5');
  cacheKeyParts.forEach(part => key.update(part));
  return key.digest('hex');
}

/**
 * [Expo] Returns an Expo-internal Babel preset for aliasing react-native and
 * react imports
 */
function buildModuleResolverPreset() {
  const expoReactNativePath = path.join(__dirname, 'react-native');
  const expoReactPath = path.join(expoReactNativePath, 'node_modules/react');
  return {
    plugins: [
      [
        require('babel-plugin-module-resolver').default,
        {
          alias: {
            react: expoReactPath,
            'react-native': expoReactNativePath,
          },
        },
      ],
    ],
  };
}

module.exports = ({
  transform,
  getCacheKey,
}: Transformer<>);
