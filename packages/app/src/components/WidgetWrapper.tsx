import { cloneElement, ReactElement, useMemo } from 'react';
import { WidgetModule } from './WidgetPreview';
import ReactHighlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import CopyButton from './CopyButton';
import ClientOnly from './ClientOnly';

export interface WidgetWrapperProps {
  name: string;
  module: WidgetModule | null;
  children: ReactElement;
}

const url = new URL(import.meta.url);
const origin = url.origin;

export default function WidgetWrapper ({ name, module, children }: WidgetWrapperProps) {

  const htmlFragment = useMemo(() => {
    return `<link rel="stylesheet" href="${origin}/widgets/style.css">

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
      style: ${JSON.stringify(module?.preferredSize)}
    }))
</script>
`;
  }, [name, module?.preferredSize]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="bg-white shadow-lg">
        {cloneElement(children, {
          style: { ...module?.preferredSize },
        })}
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
            <ReactHighlight className="language-html text-sm">
              {htmlFragment}
            </ReactHighlight>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
