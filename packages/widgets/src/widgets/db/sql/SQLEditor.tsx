import Editor from '@monaco-editor/react';

export interface SQLEditorProps {
  sql?: string;
  defaultSql?: string;
  onSqlChange?: (sql: string) => void;
}

export default function SQLEditor ({ sql, defaultSql, onSqlChange }: SQLEditorProps) {
  return (
    <Editor
      className='h-full w-full'
      value={sql}
      defaultLanguage="mysql"
      defaultValue={defaultSql}
      onChange={onSqlChange}
      options={{
        minimap: {
          enabled: false,
        }
      }}
    />
  );
}

// See https://xie.infoq.cn/article/05760cba69cfff966272eca5b
// TODO: auto completion
//
// languages.registerCompletionItemProvider('mysql', {
//
// })