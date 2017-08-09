/**
 * class construct for gulp
 */
module.exports = {
  /**
   * call first possible function
   *
   * @returns {*}
   */
  onceCall () {
    for (let index = 0, length = arguments.length; index < length; index++) {
      const argument = arguments[index];
      if (typeof argument === 'function') {
        return argument();
      }
    }

    return null;
  },

  /**
   * execute shell script
   *
   * @param command
   * @returns {Promise}
   */
  shell (command) {
    const { exec } = require('child_process');

    return new Promise((resolve, reject) => {
      const progress = exec(command);
      progress.stdout.on('data', resolve);
      progress.stderr.on('data', reject);
    });
  },

  /**
   * call function of object if exists
   * @param handler
   * @param functionName
   * @param args
   */
  optionalCall (handler, functionName, args = []) {
    return new Promise((resolve, reject) => {
      if (handler && typeof handler[functionName] === 'function') {
        try {
          const result = handler[functionName].apply(handler, args);
          return resolve(result);
        }
        catch (error) {
          reject(error);
        }
      }

      return resolve();
    });
  },
};