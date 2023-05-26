import Editor from '@monaco-editor/react';

import theme from 'monaco-themes/themes/Tomorrow.json';

theme.colors['editor.background'] = '#FFFFFF60';

export interface SQLEditorProps {
  sql?: string;
  defaultSql?: string;
  onSqlChange?: (sql: string) => void;
}

export function SQLEditor ({ sql, defaultSql, onSqlChange }: SQLEditorProps) {
  return (
    <Editor
      className="h-full w-full"
      theme="tomorrow"
      value={sql}
      defaultLanguage="mysql"
      defaultValue={defaultSql}
      onChange={onSqlChange}
      beforeMount={monaco => {
        monaco.editor.defineTheme('tomorrow', theme as any);
      }}
      options={{
        fontFamily: 'CabinSketch',
        fontSize: 16,
        padding: {
          top: 8,
        },
        minimap: {
          enabled: false,
        },
        guides: {
          indentation: false,
        },
        occurrencesHighlight: false,
        selectionHighlight: false,
        renderLineHighlight: 'none',
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
