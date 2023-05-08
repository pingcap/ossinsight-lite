const path = require('path');
const fsp = require('fs/promises');

module.exports = async function () {
  const dir = process.cwd();
  const fn = path.join(dir, 'layout.json')
  const content = require(fn);

  return {
    code: `export default ${JSON.stringify(content, undefined, 2)}`
  }
}
