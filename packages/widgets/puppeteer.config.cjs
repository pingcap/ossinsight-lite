const {join} = require('path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  executablePath: join(__dirname, '.cache/puppeteer/chrome/Chromium.app/Contents/MacOS/Chromium'),
};
