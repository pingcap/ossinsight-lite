import { Widgets } from './widget.js';
import type { Connect } from 'vite';
import type { ServerResponse } from 'http';

export default function collectManifest (entries: Widgets) {
  return entries;
}

export function makeWidgetsManifestMiddleware (widgets: Widgets) {
  return (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
    if (req.url === '/widgets-manifest.json') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.write(JSON.stringify(collectManifest(widgets), undefined, 2));
      res.end();
    } else {
      next();
    }
  };
}
