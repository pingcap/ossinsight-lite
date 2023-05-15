const path = require('path');

module.exports = async function () {
  const dir = process.cwd();
  const fn = path.join(dir, 'layout.json')
  const content = require(fn);

  return {
    code: `let layout = ${JSON.stringify(content, undefined, 2)};
    
    window.printCurrentLayout = () => console.log(JSON.stringify(layout, undefined, 2))    
    
    export default layout `
  }
}
