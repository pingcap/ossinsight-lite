import LoadingIndicator from '@ossinsight-lite/ui/components/loading-indicator';
import * as Accordion from '@radix-ui/react-accordion';
import { useEffect, useMemo, useState } from 'react';
import { ADMIN_DATABASE_NAME } from '../../../../../../utils/common';
import { Alert } from '../../../components/alert';
import { doDbSqlQuery } from '../../../utils/query';
import { AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';
import BracesIcon from './icons/braces.svg';
import ClockIcon from './icons/clock.svg';
import CpuIcon from './icons/cpu.svg';
import DatabaseIcon from './icons/database.svg';
import KeyFillIcon from './icons/key-fill.svg';
import KeyIcon from './icons/key.svg';
import NumberSvg from './icons/number.svg';
import TableIcon from './icons/table.svg';
import TypeIcon from './icons/type.svg';

export default function SchemaTree ({ db }: { db: string }) {

  return (
    <>
      <h6 className="px-2 my-2 text-md font-bold text-gray-700">Database Schema</h6>
      <DatabaseList db={db} />
    </>
  );
}

type Result<T> = {
  data: T[]
  fields: { name: string, type: number }[]
}

function Loading () {
  return (
    <div className="h-8 flex items-center justify-center text-gray-400 w-full">
      <LoadingIndicator />
    </div>
  );
}

function DatabaseList ({ db }: { db: string }) {
  const { result, loading, error } = useQuery<{ Database: string }>(db, 'SHOW DATABASES;');

  const items = useMemo(() => {
    return result?.data.filter(item => ![
      'mysql',
      'test',
      ADMIN_DATABASE_NAME,
      'sample_data',
      'INFORMATION_SCHEMA',
      'PERFORMANCE_SCHEMA',
    ].includes(item.Database));
  }, [result]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert title="Failed to fetch schema">{error.message}</Alert>;
  }

  return (
    <Accordion.Root type="single" collapsible className="text-xs">
      {items.map(item => (
        <AccordionItem key={item.Database} value={item.Database}>
          <AccordionTrigger>
            <DatabaseIcon className="text-gray-400" />
            <span>
              {item.Database}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <TablesList db={db} database={item.Database} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
}

type TableColumnName<Name extends string> = `Tables_in_${Name}`;
type DatabaseTables<Database extends string> = Record<TableColumnName<Database>, string>

function TablesList ({ db, database }: { db: string, database: string }) {

  const columnName = `Tables_in_${database}` as TableColumnName<string>;
  const { result, loading, error } = useQuery<DatabaseTables<string>>(db, `SHOW TABLES;`, database);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert title="Failed to fetch schema">{error.message}</Alert>;
  }

  return (
    <Accordion.Root type="single" collapsible>
      {result.data.map(item => (
        <AccordionItem key={item[columnName]} value={item[columnName]}>
          <AccordionTrigger>
            <TableIcon width={14} height={14} className="text-gray-400 text-xs" />
            <span>
              {item[columnName]}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnsList db={db} database={database} table={item[columnName]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
}

type ColumnDefine = {
  Default: string | null
  Extra: string
  Field: string
  Key: 'PRI'
  Null: 'YES' | 'NO'
  Type: string
}

function ColumnsList ({ db, database, table }: { db: string, database: string, table: string }) {
  const { result, loading, error } = useQuery<ColumnDefine>(db, `DESCRIBE ${table};`, database);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert title="Failed to fetch schema">{error.message}</Alert>;
  }

  return (
    <ul className="px-2">
      {result.data.map(column => (
        <li className="h-8 flex items-center" key={column.Field}>
          <Column column={column} />
        </li>
      ))}
    </ul>
  );
}

function Column ({ column }: { column: ColumnDefine }) {
  const Icon = decideIcon(column.Type);

  return (
    <span className="flex items-center gap-2">
      <Icon className="text-gray-400" />
      {column.Key === 'PRI' ? <KeyFillIcon className="text-gray-400" /> : column.Key ? <KeyIcon className="text-gray-400" /> : null}
      <span className="text-gray-500 text-xs">
        {column.Field}
      </span>
    </span>
  );
}

function decideIcon (type: string) {
  if (/json/i.test(type)) {
    return BracesIcon;
  } else if (/year|date|time/i.test(type)) {
    return ClockIcon;
  } else if (/int|double|float|numeric|real/i.test(type)) {
    return NumberSvg;
  } else if (/(var)?char|blob|short|clob|long/i.test(type)) {
    return TypeIcon;
  } else {
    return CpuIcon;
  }
}

function useQuery<T> (db: string, sql: string, use?: string) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result<T>>();
  const [error, setError] = useState<any>();
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setResult(undefined);
    setError(undefined);

    requestIdleCallback(() => {
      doDbSqlQuery({
        sql: sql,
        db: db,
        force: false,
        use,
      }, controller.signal)
        .then(res => setResult(res))
        .catch(err => setError(err))
        .finally(() => setLoading(false));
    });

    return () => {
      controller.abort();
    };
  }, [db, sql]);

  return { loading, error, result };
}


