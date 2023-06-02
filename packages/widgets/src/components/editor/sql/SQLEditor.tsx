import Editor from '@monaco-editor/react';

import theme from 'monaco-themes/themes/Tomorrow.json';

theme.colors['editor.background'] = '#FFFFFF60';

export interface SQLEditorProps {
  sql?: string;
  defaultSql?: string;
  onSqlChange?: (sql: string) => void;
  onCommand?: (command: 'run-sql') => void;
}

export function SQLEditor ({ sql, defaultSql, onSqlChange, onCommand }: SQLEditorProps) {
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
        monaco.editor.addEditorAction({
          id: 'run-sql',
          label: 'Run SQL',
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
          contextMenuGroupId: 'navigation',
          run (): void | Promise<void> {
            onCommand?.('run-sql');
          },
        });
      }}
      options={{
        fontSize: 14,
        padding: {
          top: 0,
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
        lineNumbers: 'off',
        folding: false,
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
