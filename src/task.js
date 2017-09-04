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
const isIgnoreTaskDeps = env.hasFlag(['--ignore-task-deps']);

module.exports = function(config) {
  if (typeof config.execute !== 'function') {
    throw 'Task not implemented execute function';
  }

  if (typeof config.name !== 'string') {
    throw 'Task not have an default name';
  }

  let called = 0;
  const task = function() {
    const taskName = config.name;
    config.called = called++;

    // init default configuration, only on first call
    if (config.called < 1) {
      const package = packages.load();
      config.package = package;
      config.props = {};

      if (package.config && package.config[taskName]) {
        config.props = package.config[taskName];
      }

      utils.optionalCall(config, 'onSetup');
    }


    // display help
    if (env.isHelp) {
      utils.optionalCall(config, 'onHelp');

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
      utils.optionalCall(config, 'onInstall');

      if (Array.isArray(config.dependencies)) {
        const dependecies = config.dependencies.join(' ');
        console.log(`
          Try to install packages:
          ${config.dependencies.join(', ')}
        `);

        return utils.shell(`npm install -S ${dependecies}`).
          then((result) => {
            console.log(result, 'All dependencies installed');
          }).
          catch(console.error);
      }

      return console.info('No dependencies defined');
    }

    // run task
    utils.optionalCall(config, 'onBeforeExecute');
    return Promise.all([
      // inject all dependecies
      resolver.inject(config),
    ]).then(() => {
      // execute task
      return config.execute(config);
    }).then(() => {
      // start watcher if defined
      if (env.isWatch && !config.isWatching) {
        config.isWatching = true;

        if (typeof config.watch === 'function') {
          return config.watch(config); // user defined watch function
        }
        else if (typeof config.props.watch === 'string') {
          console.info('start watching by prop', config.props.watch);
          return gulp.watch(config.props.watch, [taskName]);
        }

        utils.optionalCall(config, 'onAfterExecute');
      }
    });
  };

  /**
   * regist gulp task to stack
   *
   * @param name
   * @param deps
   */
  task.init = function(name = null, deps = []) {
    name = name ? name : config.name;
    config.internalName = config.name;
    config.name = name;

    // optional flag
    deps = isIgnoreTaskDeps ? [] : deps;

    gulp.task(name, deps, this);
  };

  return task;
};