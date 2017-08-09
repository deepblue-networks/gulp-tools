/**
 * class construct for gulp
 */
const env = require('./environment');
const utils = require('./utils');
const resolver = require('./resolver');
const packages = require('./packages');
const isInstall = env.hasFlag(['--install']);

module.exports = function(config) {
  if (typeof config.execute !== 'function') {
    throw new 'Task not implemented execute function';
  }

  return function() {
    const taskName = utils.getGulpTaskName();
    config.internalName = config.name;
    config.name = taskName;

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
        utils.shell(`npm install -S ${dependecies}`).
          then(() => console.log('All dependencies installed')).
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
    });
  };
};