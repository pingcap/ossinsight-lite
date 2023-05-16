import React, { ComponentType, createElement, forwardRef, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import widgetsManifest from './widgets-manifest';
import List from './pages/List';
import Home from './pages/Home';
import Widget from './pages/WidgetLayout';
import { useWidgetContext } from './components/WidgetContext';
import EditWidgetInstance from './pages/EditWidgetInstance';
import WidgetsManager from './components/WidgetsManager';
import { withSuspense } from '@oss-widgets/ui/utils/suspense';
import Dashboards from './pages/Dashboards';
import { NavMenu } from '@oss-widgets/ui/components/nav-menu';
import { MenuItem } from '@oss-widgets/ui/components/menu';

window.React = React;
window.ReactDOM = ReactDOM;

export default function App () {
  return (
    <WidgetsManager>
      <NavMenu name="nav" className="h-[40px] p-[4px] min-w-[250px]">
        <BrowserRouter>
          <MenuItems />
          <Routes location={window.location}>
            <Route path="/" Component={Home} />
            <Route path="/dashboards" Component={Dashboards}/>
            <Route path="/dashboards/:dashboard" Component={Home} />
            <Route path="/browse" element={<List />} />
            <Route path="/edit/:id" Component={EditWidgetInstance} />
          </Routes>
        </BrowserRouter>
      </NavMenu>
    </WidgetsManager>
  );
}

const widgets: Record<string, ComponentType<any>> = {};

const MenuItems = () => {
  const navigate = useNavigate();
  return (
    <>
      <MenuItem id="Home" group={0} order={0} text="Home" disabled={false} action={() => navigate('/')} />
      <MenuItem id="Widgets" group={0} order={1} text="Widgets" disabled={false} action={() => navigate('/browse')} />
      <MenuItem id="Dashboards" group={0} order={2} text="Dashboards" disabled={false} action={() => navigate('/dashboards')} />
    </>
  )
}
