module.exports = async function () {
  // @ts-ignore
  const {getConfig} = await import('../../../dist/utils/config.js');

  const { __filename, ...config } = await getConfig();

  return {
    code: `export default ${JSON.stringify(config, undefined, 2)}`
  }
}
