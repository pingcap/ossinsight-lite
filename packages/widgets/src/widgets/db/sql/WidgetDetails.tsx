'use client';

import clsx from 'clsx';
import { Highlight, themes } from 'prism-react-renderer';
import { forwardRef } from 'react';
import { WidgetProps } from './Widget';

const WidgetDetails = forwardRef<HTMLDivElement, WidgetProps>(function ({ sql, defaultSql, defaultDb, currentDb, visualize, forwardedRef, ...props }: WidgetProps, ref) {
  return (
    <Highlight
      theme={themes.github}
      code={sql}
      language="sql"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div ref={forwardedRef} {...props} className={clsx('p-2 text-xs rounded overflow-auto', props.className)} style={style}>
          <pre style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
});

export default WidgetDetails;
