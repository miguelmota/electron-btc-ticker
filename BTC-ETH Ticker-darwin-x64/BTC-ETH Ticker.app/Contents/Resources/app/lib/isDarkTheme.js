var exec = require('child_process').exec;
var cmd = 'if [ "$(uname)" == "Darwin" ]; then defaults read .GlobalPreferences  | grep -ic "AppleInterfaceStyle = Dark"; fi';

function isDarkTheme() {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return resolve(false);
      if (stderr) return resolve(false);
      resolve(parseInt(stdout, 10) === 1);
    });
  });
}

module.exports = isDarkTheme;
