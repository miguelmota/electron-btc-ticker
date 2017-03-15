var electron = require('electron')
var path = require('path')
var url = require('url')
var download = require('download');
var fs = require('fs');
var exec = require('child_process').exec;
var Api = require('./Api');

var app = electron.app
var Tray = electron.Tray
var BrowserWindow = electron.BrowserWindow

var currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

var appIcon;
var imageFolder = __dirname;
var trayImage = imageFolder + '/icon.png';
var text = '';
var lastText = '';

var isDark = false;

function puts(error, stdout, stderr) {
  isDark = (parseInt(stdout, 10) === 1);
}

var cmd = 'if [ "$(uname)" == "Darwin" ]; then defaults read .GlobalPreferences  | grep -ic "AppleInterfaceStyle = Dark"; fi';

exec(cmd, puts);

function getImage(text) {
  var colors = isDark ? 'fg=white' : 'fg=black';
  var url = 'http://text2png.moogs.io/image?text=' + encodeURIComponent(text) +
    '&size=12&width=240&height=20&bg=transparent&' + colors;

  download(url)
  .then(data => {
    fs.writeFileSync('icon.png', data);

    // dummy icon required to update actual icon otherwise it doesn't work
    appIcon.setImage(imageFolder + '/icon_blank.png');
    appIcon.setImage(trayImage);
  })
  .catch((error) => {
    console.error(error);
  })
}

function fetch() {
  Promise.all([
    Api.getBTCTicker(),
    Api.getETHTicker()
  ])
  .then(data => {
    var btc = data[0];
    var eth = data[1];

    text = 'BTC ' + currencyFormatter.format(btc.priceUsd) +
           ' ' + btc.percentChange24H + '%' +
           ' ETH ' + currencyFormatter.format(eth.priceUsd) +
           ' ' + eth.percentChange24H + '%';

    if (lastText !== text) {
      getImage(text);
      lastText = text;
    }
  });
}

app.on('ready', () => {
  appIcon = new Tray(imageFolder + '/icon_blank.png');

  fetch();

  setInterval(() => {
    fetch();
  }, 2500);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
