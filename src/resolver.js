/**
 * resolve all dependencies
 */
module.exports = {

  /**
   * @returns {Object}
   */
  inject(handler, callback) {
    this.load(handler.dependecies)
      .then($deps => {
        callback.apply(handler, $deps);
      });
  },

  /**
   * return the project configuration object or return empty object
   *
   * @returns {module.exports.config|*|{}}
   */
  load(dependencies) {
    return new Promise(resolve => {
      const $deps = [];

      dependencies.forEach(name => {
        const $dep = require(name);

        // map array object
        $deps[name] = $dep;
        $deps.push($dep);
      });

      resolve($deps);
    });
  },
}