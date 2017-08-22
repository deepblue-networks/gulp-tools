/**
 * setup environemnt variables
 */
const argv = require('minimist')(process.argv.slice(2));

const ENV_NAME = 'ENVIRONMENT';

const PRODUCTION = 'production';
const STAGING = 'staging';
const DEVELOPMENT = 'development';
const ENVIRONMENTS = [PRODUCTION, STAGING, DEVELOPMENT];

/**
 * is flag defined in argv
 *
 * @param flags
 * @param argv
 * @returns {boolean}
 */
function hasFlag(flags, argv = process.argv) {
  if (! Array.isArray(flags)) {
    flags = [flags];
  }
  return argv.filter(a => flags.includes(a)).length > 0;
}

/**
 * init env
 */
function initEnvironment(arg = argv) {
  const userEnv = process.env[ENV_NAME];
  // set env by user environment
  if (userEnv && ENVIRONMENTS.includes(userEnv)) {
    argv.environment = userEnv;
  }

// set env by flag
  if (arg.env && ENVIRONMENTS.includes(arg.env)) {
    argv.environment = arg.env;
  }

  // set debug
  argv.isDebug = argv.environment !== PRODUCTION;
}

// todo not static
argv.isWatch = hasFlag(['--watch', '-w']);
argv.isHelp = hasFlag(['--help', '-h']);
argv.isDebug = false;
argv.environment = PRODUCTION;
argv.environments = ENVIRONMENTS;
argv.PRODUCTION = PRODUCTION;
argv.STAGING = STAGING;
argv.DEVELOPMENT = DEVELOPMENT;
argv.hasFlag = hasFlag;
argv.initEnvironment = initEnvironment;

initEnvironment();

module.exports = argv;