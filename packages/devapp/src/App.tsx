import React, { ComponentType, createElement, forwardRef, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import widgetsManifest from './widgets-manifest';
import List from './pages/List';
import Home from './pages/Home';
import Widget from './pages/WidgetLayout';
import { useWidgetContext } from './components/WidgetContext';
import EditWidgetInstance from './pages/EditWidgetInstance';
import LayoutManager from './components/LayoutManager';

window.React = React;
window.ReactDOM = ReactDOM;

export default function App () {
  return (
    <LayoutManager>
      <BrowserRouter>
        <Routes location={window.location}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<List />} />
          <Route path="/browse" element={<Widget />}>
            {Object.keys(widgetsManifest).sort().map((name) => (
              <Route
                key={name}
                path={name}
                element={createElement(createWidgetComponent(name))}
              />
            ))}
          </Route>
          <Route path="/edit/:id" Component={EditWidgetInstance} />
        </Routes>
      </BrowserRouter>
    </LayoutManager>
  );
}

const widgets: Record<string, ComponentType<any>> = {};

function createWidgetComponent (name: string) {
  let Widget = widgets[name];
  if (widgets[name]) {
    return Widget;
  }
  const Lazy = lazy(async () => {
    const WidgetModule = await widgetsManifest[name].module();
    const InnerWidget = forwardRef(WidgetModule.default);
    const Widget = () => {
      const { props, onPropChange } = useWidgetContext();
      return (
        <div className="widget" style={WidgetModule.preferredSize}>
          <InnerWidget className="w-full h-full" {...WidgetModule.defaultProps} {...props} onPropChange={onPropChange} />
        </div>
      );
    };
    return {
      default: Widget,
    };
  });
  Widget = widgets[name] = () => {
    return (
      <Suspense
        fallback="loading"
      >
        <Lazy />
      </Suspense>
    );
  };
  return Widget;
}
