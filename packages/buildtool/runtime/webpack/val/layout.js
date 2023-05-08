const path = require('path');

module.exports = async function () {
  const dir = process.cwd();
  const fn = path.join(dir, 'layout.json')
  const content = require(fn);

  return {
    code: `let layout = ${JSON.stringify(content, undefined, 2)};
    const storedLayout = localStorage.getItem('widgets:layout');
    if (storedLayout) {
      layout = JSON.parse(storedLayout)
    }
    
    export default layout
    
    export function save (layout) {
      localStorage.setItem('widgets:layout', JSON.stringify(layout));
    }
    `
  }
}
