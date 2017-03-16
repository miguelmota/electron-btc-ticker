var electron = require('electron')
var path = require('path')
var url = require('url')
var download = require('download');
var fs = require('fs');

var api = require('./lib/api');
var isDarkTheme = require('./lib/isDarkTheme');
var {currency: cf, percent: pf} = require('./lib/formatters');

var app = electron.app
var Tray = electron.Tray
var appIcon;
var imageFolder = __dirname;
var trayImage = imageFolder + '/icon.png';
var lastText = '';
var isDark = false;

isDarkTheme()
.then(bool => (isDark = bool))
.catch(error);

app
.on('ready', () => {
  appIcon = new Tray(imageFolder + '/icon_blank.png');

  fetch();
  setInterval(() => fetch(), 2500);
})
.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

function fetch() {
  return Promise.all([
    api.getBTCTicker(),
    api.getETHTicker()
  ])
  .then(data => {
    var btc = data[0];
    var eth = data[1];

    var text = 'BTC ' + cf(btc.priceUsd) +
           ' ' + pf(btc.percentChange24H) +
           ' ETH ' + cf(eth.priceUsd) +
           ' ' + pf(eth.percentChange24H);

    if (lastText !== text) {
      return getImage(text)
        .then(setImage);

      lastText = text;
    }
  })
  .catch(error);
}

function getImage(text) {
  var color = isDark ? 'white' : 'black';
  var url = 'http://text2png.moogs.io/image?text=' + encodeURIComponent(text) +
    '&size=12&width=240&height=20&bg=transparent&fg=' + color;

  return download(url)
  .then(data => fs.writeFileSync('icon.png', data));
}

function setImage() {
  // dummy icon required to update actual icon otherwise it doesn't work
  appIcon.setImage(imageFolder + '/icon_blank.png');
  appIcon.setImage(trayImage);
}

function error(error) {
  console.error(error);
}
