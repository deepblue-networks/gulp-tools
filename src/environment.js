/**
 * setup environemnt variables
 */
const argv = require('minimist')(process.argv.slice(2));

const PRODUCTION = 'production';
const STAGING = 'staging';
const DEVELOPMENT = 'development';
const ENVIRONMENTS = [PRODUCTION, STAGING, DEVELOPMENT];

function hasFlag(flags) {
  return process.argv.filter(a => flags.includes(a)).length > 0;
}
// todo not static
argv.isWatch = hasFlag(['--watch', '-w']);
argv.isHelp = hasFlag(['--help', '-h']);
argv.isDebug = false;
argv.environment = PRODUCTION;
argv.environments = ENVIRONMENTS;
argv.hasFlag = hasFlag;

// set env by user environment
if (process.env.hasOwnProperty('ENVIRONMENT')) {
  argv.environment = process.env.ENVIRONMENT;
}

// set env by flag
if (argv.env && ENVIRONMENTS.includes(argv.env)) {
  argv.environment = argv.env;
}

module.exports = argv;