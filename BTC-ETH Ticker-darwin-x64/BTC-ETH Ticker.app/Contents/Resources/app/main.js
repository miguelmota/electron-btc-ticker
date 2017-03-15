var electron = require('electron')
var path = require('path')
var url = require('url')
var download = require('download');
var fs = require('fs');
var Api = require('./Api');

var app = electron.app
var Tray = electron.Tray
var BrowserWindow = electron.BrowserWindow

var currencyFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

var appIcon;
var imageFolder = __dirname;
var trayImage = imageFolder + '/icon.png';
var text = '';
var lastText = '';

function getImage(text) {
  var url = 'http://moogs.io:9361/image?text=${text}';

  download(url)
  .then(data => {
    fs.writeFileSync('icon.png', data);

    // dummy icon required to update actual icon
    appIcon.setImage(imageFolder + '/icon-1.png');
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

    text = 'BTC ${currencyFormatter.format(btc.priceUsd)} ETH ${currencyFormatter.format(eth.priceUsd)}';

    if (lastText !== text) {
      getImage(text);
      lastText = text;
    }
  });
}

fetch();

setInterval(() => {
  fetch();
}, 2500);

app.on('ready', () => {
  appIcon = new Tray(trayImage);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
