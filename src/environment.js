/**
 * setup environemnt variables
 */
const argv = require('minimist')(process.argv.slice(2));

function hasFlag(flags) {
  return process.argv.filter(a => flags.includes(a)).length > 0;
}
// todo not static
argv.isWatch = hasFlag(['--watch', '-w']);
argv.isHelp = hasFlag(['--help', '-h']);
argv.isDebug = true;
argv.environment = process.env.hasOwnProperty('ENVIRONMENT') ? process.env.ENVIRONMENT : 'production';
argv.hasFlag = hasFlag;

module.exports = argv;