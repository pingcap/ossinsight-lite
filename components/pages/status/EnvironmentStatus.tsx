export default function EnvironmentStatus () {
  return (
    <section>
      <h3>Environment Variables</h3>
      <table className="data-table kv-table table-auto">
        <tbody>
        {envs.map(env => (
          <tr key={env}>
            <td>{env}</td>
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
  return '********';
}
