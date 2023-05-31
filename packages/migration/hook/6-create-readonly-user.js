module.exports.before_migration = () => {
  process.env.READONLY_USERNAME = process.env.TIDB_USER?.replace(/\.[^.]*$/, '.osslreadonly')
  process.env.READONLY_PASSWORD = process.env.TIDB_PASSWORD + '.osslreadonly'
}