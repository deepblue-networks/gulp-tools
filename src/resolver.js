/**
 * resolve all dependencies
 */
module.exports = {

  /**
   * inject depence
   *
   * @param handler
   * @param callback
   * @returns {Promise.<TResult>}
   */
  inject(handler, callback) {
    return this.load(handler.dependencies)
      .then($deps => {
        handler.$deps = $deps;

        if (callback) {
          callback.apply(handler, $deps);
        }
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