import React, { useCallback, useRef } from 'react';
import MonacoEditor, { OnChange } from '@monaco-editor/react';
import './prepare-editor';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export interface EditorProps {
  language: string;
  value: string;
  onChange: OnChange;
  onAction: (editor: IStandaloneCodeEditor, id: string) => void;
}

export default function Editor ({ language, value, onChange, onAction }: EditorProps) {

  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  const handleMount = useCallback((editor: IStandaloneCodeEditor) => {
    editor.addAction({
      id: 'run-sql',
      label: 'Run SQL',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR],
      contextMenuOrder: 0,
      run () {
        onActionRef.current(editor, 'run-sql');
      },
    });

  }, []);

  return (
    <MonacoEditor
      onMount={handleMount}
      width="100%"
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="light"
    />
  );
}
