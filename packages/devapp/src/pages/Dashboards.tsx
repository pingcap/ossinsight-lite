import { useCollectionKeys, useReactBindCollections } from '@oss-widgets/ui/hooks/bind';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../components/WidgetsManager';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import RoughBox from '@oss-widgets/ui/components/roughness/shape/box';

export default function () {
  const keys = useCollectionKeys(useReactBindCollections());
  const { config } = useConfig();
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const onCreate = useRefCallback(() => {
    navigate(`/dashboards/${encodeURIComponent(text)}`);
  });

  const dashboards = useMemo(() => {
    const initialConfigKeys = Object.keys(config?.dashboard ?? {});
    const stale = keys.flatMap(key => {
      const res = /^dashboard\.(\w+)\.items$/.exec(key);
      if (res) {
        return [res[1]];
      } else {
        return [];
      }
    });

    return [...new Set([...initialConfigKeys, ...stale])].sort();
  }, [config, keys]);

  return (
    <div className="container m-auto p-4">
      <ul>
        {dashboards.map(dashboard => {
          if (dashboard !== 'default') {
            return <li key={dashboard}><Link to={`/dashboards/${encodeURIComponent(dashboard)}`}>{dashboard}</Link></li>;
          } else {
            return <li key={dashboard}><Link to="/">default</Link></li>;
          }
        })}
        <li>
          <input
            placeholder="Input to create new..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="inline-block relative mx-2 overflow-visible" onClick={onCreate}>
            <span className='z-10 px-2'>
              Create new dashboard
            </span>
            <RoughBox color="#93a376" />
          </button>
        </li>
      </ul>
    </div>
  );
}
