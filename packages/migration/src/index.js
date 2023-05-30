const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');
const mysql2 = require('mysql2/promise');
const {hashSync} = require('bcrypt')

require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env')
});

process.env.READONLY_USERNAME = process.env.TIDB_USER?.replace(/\.[^.]*$/, '.osslreadonly')
process.env.READONLY_PASSWORD = process.env.TIDB_PASSWORD + '.osslreadonly'

const URI = `mysql://${process.env.TIDB_USER}:${process.env.TIDB_PASSWORD}@${process.env.TIDB_HOST}:${process.env.TIDB_PORT}?timezone=Z&ssl={"rejectUnauthorized":true,"minVersion":"TLSv1.2"}`;
/**
 * @type {import('mysql2/promise').Connection}
 */
let conn;

async function main() {
  try {
    conn = await mysql2.createConnection(URI);
  } catch (e) {
    console.warn("unable to connect database", e)
    process.exit(0)
  }
  const files = glob.globSync('sql/*.sql').sort();

  let lastName

  try {
    await conn.execute('use `ossinsight_lite_admin`');
    const [rows] = await conn.execute('SELECT name FROM _migrations ORDER BY migrated_at DESC LIMIT 1');
    if (rows.length !== 0) {
      lastName = rows[0].name
    }
  } catch (e) {
  }

  let i = lastName ? files.indexOf(lastName) + 1 : 0;

  if (i === files.length) {
    console.log('no migration required.')
  }

  for (; i < files.length; i++) {
    const fn = files[i];
    console.log('migrating:', fn)

    const hookFile = fn.replace(/^sql/, 'hook')
      .replace(/\.sql/, '.js')
    if (fs.existsSync(hookFile)) {
      const hook = require(path.join(process.cwd(), hookFile));
      if (hook.before_migration) {
        console.log('\t exec hook: before_migration')
        await hook.before_migration();
      }
    }

    const content = fs.readFileSync(fn, {encoding: 'utf-8'});
    const commands = content.split(';').map(c => c.trim()).filter(Boolean);

    for (const command of commands) {
      console.log('\texec: ', command.split('\n').map(s => `\t\t${s.trimStart()}`).join('\n'));

      const [sql, values, havPlaceholders] = parsePlaceholders(command)

      const [res] = await conn.execute({
        sql,
        values: havPlaceholders ? values : undefined,
        namedPlaceholders: havPlaceholders,
      });
      console.log('\tAffected rows:', res.affectedRows)
    }

    await conn.execute(`INSERT INTO _migrations(name)
                        VALUES (?)`, [fn]);
    console.log('migrated:', fn)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(-1)
}).finally(() => {
  conn.destroy();
})

function parsePlaceholders(sql) {
  const REGEXP = /:env_([A-Za-z_]+)/g;
  const REPLACE_REGEXP = /\$\{([A-Za-z_]+)}/g;
  const res = {}

  /**
   * @type {RegExpExecArray}
   */
  let matched

  sql = sql.replace(REPLACE_REGEXP, (_, g) => process.env[g]);

  while ((matched = REGEXP.exec(sql))) {
    const [, name] = matched;

    res[name] = process.env[name] || defaultEnv[name];
    if (typeof res[name] !== 'string') {
      throw new Error(`env ${name} was not a string.`)
    }
  }

  console.log('\tvalues:', res);

  return [sql.replace(REGEXP, (_, g) => `:${g}`), res, Object.keys(res).length > 0];
}

const defaultEnv = {
  INITIAL_PASSWORD: hashSync(process.env.SITE_INITIAL_PASSWORD || 'tidbcloud', 1),
}
