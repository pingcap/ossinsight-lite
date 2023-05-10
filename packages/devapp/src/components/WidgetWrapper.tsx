import { cloneElement, lazy, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import manifest, { WidgetModule } from '../widgets-manifest';

import CopyButton from './CopyButton';
import { Light as SyntaxHighlight, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import ClientOnly from './ClientOnly';
import { WidgetContextProvider } from './WidgetContext';

async function SyntaxHighlightLazy () {
  const [xml, js, style] = await Promise.all([
    import('react-syntax-highlighter/dist/esm/languages/hljs/xml'),
    import('react-syntax-highlighter/dist/esm/languages/hljs/javascript'),
    import('react-syntax-highlighter/dist/esm/styles/hljs/github'),
  ]);

  SyntaxHighlight.registerLanguage('html', xml.default);
  SyntaxHighlight.registerLanguage('javascript', js.default);

  return {
    default: function ({ ...props }: SyntaxHighlighterProps) {
      return <SyntaxHighlight {...props} style={style.default} language="html" codeTagProps={{ className: '!font-[CabinSketch]' }} />;
    },
  };
}

const HTMLSyntaxHighlight = lazy(SyntaxHighlightLazy);

export interface WidgetWrapperProps {
  name: string;
  children: ReactElement;
}

const origin = process.env.OSSW_SITE_DOMAIN;

export default function WidgetWrapper ({ name, children }: WidgetWrapperProps) {
  const [module, setModule] = useState<WidgetModule>();
  const { props, updateProp } = useWidgetProps();

  useEffect(() => {
    manifest[name].module().then(module => setModule(module));
  }, [name]);

  const htmlFragment = useMemo(() => {
    return `<link rel="stylesheet" href="${origin}/widgets/style.css">
<link rel="stylesheet" href="${origin}/widgets/${name}/style.css">

<!-- This project rely was built on React, so we need these two libraries. -->
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>

<!-- To prevent css pollution, the widget element should have a css class 'widget' -->
<div class="widget" id="widget" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #d8d8d8"></div>

<script type="module">
  import Widget from '${origin}/widgets/${name}/index.js'
  ReactDOM
    .createRoot(document.getElementById('widget'))
    .render(React.createElement(Widget, {
      style: ${JSON.stringify(module?.preferredSize)},
      ...(${JSON.stringify({ ...module?.defaultProps, ...props }, undefined, 2).replace(/\n/g, '\n      ')})
    }))
</script>
`;
  }, [name, module?.preferredSize, module?.defaultProps, props]);

  return (
    <div className="py-4 w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="bg-white shadow-lg">
        <WidgetContextProvider
          value={{
            enabled: false,
            configurable: false,
            configure () {},
            props,
            onPropChange: updateProp,
          }}
        >
          {cloneElement(children, {
            style: { ...module?.preferredSize },
          })}
        </WidgetContextProvider>
      </main>
      <div className="w-[680px]">
        <div className="mt-2 p-2 text-gray-400 border rounded bg-white">
          {'[TODO] Share to twitter'}
        </div>
        <div className="mt-2 border rounded overflow-x-auto bg-white">
          <div className="p-2 text-gray-400 flex justify-between items-center">
            <span>
              Embed into HTML
            </span>
            <CopyButton content={htmlFragment} />
          </div>
          <ClientOnly>
            {() => (
              <HTMLSyntaxHighlight className="text-sm">
                {htmlFragment}
              </HTMLSyntaxHighlight>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}

function useWidgetProps () {
  const [props, setProps] = useState<Record<string, any>>({})

  const updateProp = useCallback((name: string, value: any) => {
    setProps(props => ({ ...props, [name]: value }))
  }, [])

  return {
    props,
    updateProp,
  }
}
