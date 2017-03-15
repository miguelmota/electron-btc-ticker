'use strict';

var packager = require('electron-packager');

var opts = {
  dir: './',
  name: 'BTC/ETH Ticker',
  platform: 'darwin',
  arch: 'x64',
  version: '0.36.1',
  icon: './icon.icns',
  overwrite: true
};

packager(opts, function done(err, appPath) {
  if (err) {
    console.error(err);
  }
  console.log(appPath);
});
