export interface ResultTableProps {
  result?: {
    data: any[]
    columns: { name: string }[]
  } | undefined;
  running?: boolean;
}

export default function TableVisualize ({ result, running }: ResultTableProps) {
  if (!result) {
    return (
      <div className="w-full h-full flex items-center justify-center border-t">
        {running ? 'Running...' : 'No data'}
      </div>
    );
  }
  return (
    <div className="w-full h-full overflow-auto">
      <table className="sql-result-table min-w-full">
        <thead>
        <tr>
          <th>#</th>
          {result.columns.map(col => <th key={col.name}>{col.name}</th>)}
        </tr>
        </thead>
        <tbody>
        {result.data.map((item, i) => (
          <tr key={i}>
            <th>{i + 1}</th>
            {result.columns.map(col => <AutoCollapse key={col.name} value={item[col.name]} />)}
          </tr>
        ))}
        </tbody>
      </table>

    </div>
  );
}

function AutoCollapse ({ value }: { value: any }) {
  return (
    <td>
      <span className="inline-block max-w-[120px] text-ellipsis whitespace-nowrap overflow-hidden">{value}</span>
    </td>
  );
}
