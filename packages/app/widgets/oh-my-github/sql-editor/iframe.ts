export function updateIframe (iframe: HTMLIFrameElement, script: string) {
  const document = iframe.contentDocument;

  let viewportMeta = document.getElementById('vp');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.id = 'vp';
    viewportMeta.setAttribute('name', 'viewport');
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    document.head.appendChild(viewportMeta)
  }

  let style = document.getElementById('style')
  if (!style) {
    style = document.createElement('style');
    style.id = 'style';
    style.textContent = `
      html, body {
         margin: 0; padding: 0;
         width: 100vw;
         height: 100vh;
      }
    `
    document.head.appendChild(style);
  }

  let initScript: HTMLScriptElement = document.getElementById('x-init-script') as HTMLScriptElement;

  if (!initScript) {
    initScript = document.createElement('script');
    initScript.id = 'x-init-script';
    initScript.textContent = `
    let reloadFn = () => {};
    window.onmessage = (ev) => {
      if (ev.data?.type === 'reload-data') {
        reloadFn(ev.data.data);
      }
    }
    
    function whenReload (fn) {
      reloadFn = fn;
    }
    `;

    document.head.appendChild(initScript);
  }

  let userScript: HTMLScriptElement = document.getElementById('x-user-script') as HTMLScriptElement;

  if (userScript) {
    userScript.remove();
  }

  userScript = document.createElement('script');
  userScript.id = 'x-user-script';
  userScript.type = 'module';
  userScript.textContent = script;
  document.head.appendChild(userScript);

  if (!document.getElementById('app')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);
  }
}