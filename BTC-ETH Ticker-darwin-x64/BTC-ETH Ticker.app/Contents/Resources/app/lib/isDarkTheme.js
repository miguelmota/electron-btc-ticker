var exec = require('child_process').exec;
var cmd = 'if [ "$(uname)" == "Darwin" ]; then defaults read .GlobalPreferences  | grep -ic "AppleInterfaceStyle = Dark"; fi';

function isDarkTheme() {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      resolve(parseInt(stdout, 10) === 1);
    });
  });
}

module.exports = isDarkTheme;
