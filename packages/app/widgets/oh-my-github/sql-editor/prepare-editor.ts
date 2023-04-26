import { loader } from '@monaco-editor/react';

import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {

    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};


await loader.config({ monaco });

