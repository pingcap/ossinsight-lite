import React, { HTMLProps, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { FileTabs } from './FileTabs';
import Editor from './Editor';
import { updateIframe } from './iframe';
import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export type Files = 'request.sql' | 'chart.js'
const files: Files[] = ['request.sql', 'chart.js'];
export default function Widget (props: HTMLProps<HTMLDivElement>) {
  const [currentFile, setCurrentFile] = useState<Files>('request.sql');
  const [values, setValues] = useState<Record<Files, string>>({
    'request.sql': DEFAULT_SQL,
    'chart.js': DEFAULT_JS,
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentFileRef = useRef(currentFile);
  currentFileRef.current = currentFile;

  const handleChange = useCallback((value: string) => {
    setValues(cache => {
      cache[currentFileRef.current] = value;
      return cache;
    });
  }, []);

  const handleAction = useCallback((editor: IStandaloneCodeEditor, action: string) => {
    const iframe = iframeRef.current!;
    updateIframe(iframe, editor.getValue());
  }, []);

  return (
    <div {...props} className={clsx('flex flex-col', props.className)}>
      <header className="h-8 border-b">
        <FileTabs<Files> current={currentFile} files={files} onChange={setCurrentFile} />
      </header>
      <main className="h-full flex-1 bg-blue-200">
        <Editor {...config[currentFile]} value={values[currentFile]} onChange={handleChange} onAction={handleAction} />
      </main>
      <footer className="flex-1 p-2 border-t">
        <iframe ref={iframeRef} className='w-full h-full'>
        </iframe>
      </footer>
    </div>
  );
}

const DEFAULT_SQL = `-- oh-my-github/personal-overview/earned_stars.sql

WITH events AS (SELECT id, user_id, created_at, 'issue' AS type
                FROM issues
                UNION ALL
                SELECT id, user_id, created_at, 'pull_request' AS type
                FROM pull_requests
                UNION ALL
                SELECT id, user_id, created_at, 'issue_comment' AS type
                FROM issue_comments
                UNION ALL
                SELECT id, user_id, created_at, 'commit_comment' AS type
                FROM commit_comments)

SELECT DATE_FORMAT(events.created_at, '%Y-%m-01') AS month, type, COUNT(*) AS cnt
FROM events
         JOIN curr_user ON events.user_id = curr_user.id
GROUP BY 1, 2
ORDER BY 1 ASC

`;

const DEFAULT_JS = `import 'https://unpkg.com/chart.js@4.2.1/dist/chart.umd.js'

new Chart(document.getElementById('canvas'), {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});`;

const config: Record<Files, { language: string, value: string }> = {
  'request.sql': {
    language: 'mysql',
    value: DEFAULT_SQL,
  },
  'chart.js': {
    language: 'javascript',
    value: DEFAULT_JS,
  },
};
