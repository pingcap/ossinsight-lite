import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import List from './pages/List';
import Home from './pages/Home';
import EditWidgetInstance from './pages/EditWidgetInstance';
import WidgetsManager from './components/WidgetsManager';
import Dashboards, { useDashboards } from './pages/Dashboards';
import { NavMenu } from '@oss-widgets/ui/components/nav-menu';
import { MenuItem } from '@oss-widgets/ui/components/menu';
import { withSuspense } from '@oss-widgets/ui/utils/suspense';
import ThreeDotsIcon from './icons/three-dots.svg';

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
            <Route path="/dashboards" Component={Dashboards} />
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

const MenuItems = withSuspense(() => {
  const navigate = useNavigate();
  const dashboards = useDashboards();
  return (
    <>
      <MenuItem id="Logo" order={0} text="Home" disabled={false} custom>
        <span>
          OSSInsight Lite
        </span>
      </MenuItem>
      <MenuItem id="sep" order={1} disabled={false} separator />
      <MenuItem id="More" order={100} text={<ThreeDotsIcon />} disabled={false} parent>
        <MenuItem id="Dashboards" order={1} text="Dashboards" disabled={false} parent>
          {dashboards.map((dashboard, index) => <MenuItem key={dashboard} id={dashboard} order={index} disabled={false} text={dashboard} action={() => navigate(dashboard === 'default' ? '/' : `/dashboards/${dashboard}`)} />)}
        </MenuItem>
        <MenuItem id="Widgets" order={1} text="Widgets" disabled={false} action={() => navigate('/browse')} />
      </MenuItem>
    </>
  );
});
