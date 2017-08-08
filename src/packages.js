/**
 * load package json as object, base on the root of executation
 *
 * @type {{_package: null, load: (function())}}
 */
module.exports = {
  _package: null,

  /**
   * @returns {Object}
   */
  load() {
    if (!this._package) {
      this._package = require(process.cwd() + '/package.json');
    }
    return this._package;
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