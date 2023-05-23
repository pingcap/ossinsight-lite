export default function EnvironmentStatus () {
  return (
    <section>
      <h3>Environment Variables</h3>
      <table className="data-table table-auto">
        <thead>
        <tr>
          <th>Name</th>
          <td>Value</td>
        </tr>
        </thead>
        <tbody>
        {envs.map(env => (
          <tr key={env}>
            <th>{env}</th>
            <td>{erasedEnvValue(env)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </section>
  );
}
const envs: string [] = [
  'TIDB_HOST',
  'TIDB_USER',
  'TIDB_PASSWORD',
  'TIDB_PORT',
];

function erasedEnvValue (env: string) {
  const value = process.env[env];
  if (value == null) {
    return '(not set)';
  }
  if (value.length <= 4) {
    return value[0] + '***';
  }
  return value.slice(0, 2) + '*'.repeat(6) + value.slice(value.length - 2);
}
