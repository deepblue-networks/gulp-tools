/**
 * load package json as object, base on the root of executation
 *
 * @type {{_package: null, load: (function())}}
 */
module.exports = {

  /**
   * @returns {Object}
   */
  load(file = 'package.json') {
    return require(process.cwd() + `/${file}`);
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