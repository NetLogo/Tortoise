// Adapted from https://github.com/vojtajina/grunt-coffeelint/blob/master/tasks/coffeelint.js
const coffeelint = require('coffeelint');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const reporter = require('coffeelint-stylish').reporter;

const argv = process.argv;
if (argv.includes('-h') || argv.includes('--help')) {
  console.log(`
Manually run Coffeelint on source files, adapted from grunt-coffeelint
This is used because coffeelint doesn't support globs.

Currently it only supports a single path, which can contain globs.

Usage:  node linter.js -h|--help|[src]

  src           Path to be expanded

Options:
  -h | --help   Print this message
`);
  process.exit(0);
}

let globPath = 'src/main/coffee/**/*.coffee';
let config;
try {
  config = JSON.parse(fs.readFileSync('./coffeelint.json'));
} catch (error) {
  console.log(error);
  process.exit(1);
}

if (process.argv.length > 2) {
  globPath = process.argv[2];
}

glob(globPath, (err, files) => {
  if (err) {
    console.log(`Error expanding files: ${err}`);
    process.exit(1);
  }

  let errorCount = 0;
  let warnCount = 0;

  for (const file of files) {
    // console.log('Linting ' + file + '...');
    const errors = coffeelint.lint(
      fs.readFileSync(file, 'utf-8', 'r+'),
      config
    );

    if (!errors.length) {
      continue;
      //   return grunt.verbose.ok();
    }

    reporter(file, errors);

    errors.forEach(function (error) {
      let status, message;

      if (error.level === 'error') {
        errorCount += 1;
      } else if (error.level === 'warn') {
        warnCount += 1;
      } else {
        return;
      }

      message =
        file +
        ':' +
        error.lineNumber +
        ' ' +
        error.message +
        ' (' +
        error.rule +
        ')';

      //   grunt.event.emit('coffeelint:' + error.level, error.level, message);
      console.log('coffeelint:' + error.level, error.level, message);
      //   grunt.event.emit('coffeelint:any', error.level, message);
      //   console.log('coffeelint:any', error.level, message);
    });
  }

  if (errorCount && !config.force) {
    return false;
  }

  if (!warnCount && !errorCount) {
    console.log(
      files.length + ' file' + (files.length === 1 ? '' : 's') + ' lint free.'
    );
  }

  if (errorCount) {
    process.exit(1);
  }
});
