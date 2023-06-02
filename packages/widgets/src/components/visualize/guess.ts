import { VisualizeType } from './common';

const Types = {
  0x00: 'DECIMAL', // aka DECIMAL
  0x01: 'TINY', // aka TINYINT, 1 byte
  0x02: 'SHORT', // aka SMALLINT, 2 bytes
  0x03: 'LONG', // aka INT, 4 bytes
  0x04: 'FLOAT', // aka FLOAT, 4-8 bytes
  0x05: 'DOUBLE', // aka DOUBLE, 8 bytes
  0x06: 'NULL', // NULL (used for prepared statements, I think)
  0x07: 'TIMESTAMP', // aka TIMESTAMP
  0x08: 'LONGLONG', // aka BIGINT, 8 bytes
  0x09: 'INT24', // aka MEDIUMINT, 3 bytes
  0x0a: 'DATE', // aka DATE
  0x0b: 'TIME', // aka TIME
  0x0c: 'DATETIME', // aka DATETIME
  0x0d: 'YEAR', // aka YEAR, 1 byte (don't ask)
  0x0e: 'NEWDATE', // aka ?
  0x0f: 'VARCHAR', // aka VARCHAR (?)
  0x10: 'BIT', // aka BIT, 1-8 byte
  0xf5: 'JSON',
  0xf6: 'NEWDECIMAL', // aka DECIMAL
  0xf7: 'ENUM', // aka ENUM
  0xf8: 'SET', // aka SET
  0xf9: 'TINY_BLOB', // aka TINYBLOB, TINYTEXT
  0xfa: 'MEDIUM_BLOB', // aka MEDIUMBLOB, MEDIUMTEXT
  0xfb: 'LONG_BLOB', // aka LONGBLOG, LONGTEXT
  0xfc: 'BLOB', // aka BLOB, TEXT
  0xfd: 'VAR_STRING', // aka VARCHAR, VARBINARY
  0xfe: 'STRING', // aka CHAR, BINARY
  0xff: 'GEOMETRY', // aka GEOMETRY
} as const;

type ColumnType = (typeof Types)[keyof typeof Types];
const TypeIds = Object.entries(Types).reduce((prev, [k, v]) => {
  prev[v] = parseInt(k);
  return prev;
}, {} as Record<ColumnType, number>);

const NumberTypes: Set<number> = new Set([
  TypeIds.SHORT,
  TypeIds.INT24,
  TypeIds.LONG,
  TypeIds.LONGLONG,
  TypeIds.FLOAT,
  TypeIds.DECIMAL,
  TypeIds.NEWDECIMAL,
  TypeIds.FLOAT,
  TypeIds.DOUBLE,
]);

const DateTypes: Set<number> = new Set([
  TypeIds.DATE,
  TypeIds.DATETIME,
  TypeIds.NEWDATE,
  TypeIds.YEAR,
  TypeIds.TIME,
  TypeIds.TIMESTAMP,
]);

const CategoryTypes: Set<number> = new Set([
  ...DateTypes,
  TypeIds.STRING,
  TypeIds.VARCHAR,
  TypeIds.VAR_STRING,
]);

type Result = { data: any[], columns: { name: string, type: number }[] };

const xyCharts: VisualizeType['type'][] = ['chart:line', 'chart:bar'];

export function migrate (previous: VisualizeType | undefined, next: VisualizeType['type'] | undefined, result: Result): VisualizeType {
  if (previous) {
    if (next) {
      if (xyCharts.includes(previous.type) && xyCharts.includes(next)) {
        return {
          ...previous,
          type: next,
        } as any;
      }
      return guessWithType(result, next);
    } else {
      return previous;
    }
  } else {
    if (next) {
      return guessWithType(result, next);
    } else {
      return guessFromScratch(result);
    }
  }
}

function guessFromScratch (result: Result): VisualizeType {
  if (result.data.length === 1 && result.columns.length === 1) {
    return {
      type: 'gauge',
      title: result.columns[0].name,
    };
  }

  if (result.columns.length === 2) {
    const firstNumberColumn = result.columns.findIndex(col => NumberTypes.has(col.type));
    const categoryColumn = 1 - firstNumberColumn;
    return {
      type: 'chart:bar',
      x: {
        type: DateTypes.has(result.columns[categoryColumn].type) ? 'datetime' : 'category',
        field: result.columns[categoryColumn].name,
        label: result.columns[categoryColumn].name,
      },
      y: {
        type: 'value',
        field: result.columns[firstNumberColumn].name,
        label: result.columns[firstNumberColumn].name,
      },
      title: 'Untitled',
    };
  }

  return {
    type: 'table',
    title: 'Untitled',
  };
}

function ifNotFoundThen(index: number, then: number): number {
  if (index === -1) {
    return then
  } else {
    return index;
  }
}

function guessWithType (result: Result, next: VisualizeType['type']): VisualizeType {
  switch (next) {
    case 'chart:line':
    case 'chart:bar': {
      const firstNumberColumn = ifNotFoundThen(result.columns.findIndex(col => NumberTypes.has(col.type)), 0);
      const categoryColumn = ifNotFoundThen(result.columns.findIndex(col => CategoryTypes.has(col.type)), firstNumberColumn > 0 ? 0 : Math.min(1, result.columns.length));
      return {
        type: next,
        x: {
          type: DateTypes.has(result.columns[categoryColumn].type) ? 'datetime' : 'category',
          field: result.columns[categoryColumn].name,
          label: result.columns[categoryColumn].name,
        },
        y: {
          type: 'value',
          field: result.columns[firstNumberColumn].name,
          label: result.columns[firstNumberColumn].name,
        },
        title: 'Untitled',
      };
    }
    case 'gauge':
      return {
        type: 'gauge',
        title: result.columns[0]?.name ?? 'Untitled',
      };
    case 'table':
      return {
        type: 'table',
        title: 'Untitled',
      };
  }
}
