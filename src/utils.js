/**
 * class construct for gulp
 */
module.exports = {
  /**
   * call first possible function
   *
   * @returns {*}
   */
  onceCall() {
    for (let index = 0, length = arguments.length; index < length; index++) {
      const argument = arguments[index];
      if (typeof argument === 'function') {
        return argument();
      }
    }

    return null;
  },

  /**
   * return the name of current running gulp task
   *
   * @returns {*|T}
   */
  getGulpTaskName() {
    const gulp = require('gulp');
    return gulp.seq.slice(-1)[0];
  },
}