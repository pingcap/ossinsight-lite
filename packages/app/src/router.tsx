import { RouteObject } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Widget from './components/Widget';
import manifest from 'app:widgets-manifest';
import Main from './components/Main';

function makeRouteItems (): RouteObject[] {
  return Object.entries(manifest).map(([key, widget]) => ({
    path: key,
    element: (
      <Widget name={key} widget={widget as any} />
    ),
  }));
}

export default createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  ...makeRouteItems(),
]);
