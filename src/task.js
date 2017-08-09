/**
 * task construct for gulp
 *
 * @flags install, help
 * @example
 *  const task = task({
 *    name: String,
 *    description: String,
 *    dependencies: Array,
 *    execute: Function,
 *   }).init('new_task_name', [...deps]);
 */
const gulp = require('gulp');
const env = require('./environment');
const utils = require('./utils');
const resolver = require('./resolver');
const packages = require('./packages');
const isInstall = env.hasFlag(['--install']);

module.exports = function(config) {
  if (typeof config.execute !== 'function') {
    throw 'Task not implemented execute function';
  }

  if (typeof config.name !== 'string') {
    throw 'Task not have an default name';
  }

  const task = function() {
    const taskName = config.name;

    // display help
    if (env.isHelp) {
      return utils.onceCall(
        config.help,
        () => {
          const description = config.description
            ? config.description
            : 'No description';
          const dependencies = Array.isArray(config.dependencies)
            ? config.dependencies.join(', ')
            : 'none';
          const author = config.author || 'unknow';

          console.log(`
            Task ${taskName}
            ${description}
            
            @internalName ${config.name}
            @dependencies ${dependencies}
            @author ${author}
          `);
        },
      );
    }

    // install progress
    if (isInstall) {
      if (Array.isArray(config.dependencies)) {
        const dependecies = config.dependencies.join(' ');

        return utils.shell(`npm install -S ${dependecies}`).
          then((result) => {
            console.log(result, 'All dependencies installed');
          }).
          catch(console.error);
      }

      return console.info('No dependencies defined');
    }

    // run task
    return Promise.all(
      [
        // inject all dependecies
        resolver.inject(config),

        // setup packages and configuration
        new Promise(resolve => {
          const package = packages.load();
          config.package = package;
          config.props = {};

          if (package.config && package.config[taskName]) {
            config.props = package.config[taskName];
          }

          resolve();
        }),
      ],
    ).then(() => {
      return config.execute(config);
    }).then(() => {
      if (env.isWatch && !config.isWatching) {
        config.isWatching = true;

        if (typeof config.watch === 'function') {
          return config.watch(config); // user defined watch function
        }
        else if (typeof config.props.watch === 'string') {
          console.info('start watching by prop', config.props.watch);
          return gulp.watch(config.props.watch, [taskName]);
        }
      }
    });
  };

  /**
   * regist gulp task to stack
   *
   * @param name
   * @param deps
   */
  task.init = function(name = null, deps = null) {
    name = name ? name : config.name;
    config.internalName = config.name;
    config.name = name;

    gulp.task(name, this, deps);
  };

  return task;
};