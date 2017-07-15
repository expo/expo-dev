/**
 * Helps make rn-cli.config.js files for the copy of React Native in this lab.
 *
 * This file is not compiled before it is run, so be careful about its syntax.
 */
'use strict';

const path = require('path');

const babelRegisterOnly = require('./react-native/node_modules/metro-bundler/build/babelRegisterOnly');

const registeredTransformModulePaths = new Set();

module.exports = {
  getUniverseRoot() {
    return path.join(__dirname, '..');
  },

  getLabTransformerPath() {
    const modulePath = path.resolve(__dirname, 'transformer.js');
    if (!registeredTransformModulePaths.has(modulePath)) {
      babelRegisterOnly([modulePath]);
      registeredTransformModulePaths.add(modulePath);
    }
    return modulePath;
  },
};
