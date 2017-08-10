const fs = require('fs');
const environment = require('./environment').environment;
const deepAssign = require('deep-assign');

const FILE_NAME = 'package';
const FILE_EXT = '.json';

function loadFile(file) {
  let data = {};
  if (fs.existsSync(file)) {
    const fileData = require(file);
    if (typeof fileData === 'object') {
      data = fileData;
    }
  }
  return fileData;
}

/**
 * load package json as object, base on the root of executation
 *
 * @type {{_package: null, load: (function())}}
 */
module.exports = {
  package: null,

  /**
   * @returns {Object}
   */
  load() {
    // singleton loading
    if (this.package) {
      return this.package;
    }

    const cwd = process.cwd();
    // load main file
    const mainPackage = loadFile(`${cwd}/${FILE_NAME}.${FILE_EXT}`);
    // env file
    const envPackage = loadFile(`${cwd}/${FILE_NAME}.${environment}.${FILE_EXT}`);

    this.package = deepAssign(mainPackage, envPackage);
    return this.package;
  },

  /**
   * return the project configuration object or return empty object
   *
   * @returns {module.exports.config|*|{}}
   */
  config() {
    const config = this.load().config;

    if (!config) {
      console.warn('configuration not defined');
    }
    return config || {};
  },
}