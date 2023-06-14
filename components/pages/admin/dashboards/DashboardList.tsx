'use client';
import { AddDashboardForm, ChangeVisibleButton, DeleteDashboardButton } from '@/components/pages/admin/dashboards/forms';
import Tooltip from '@/components/Tooltip';
import BoxArrowUpRightIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg';
import PencilIcon from 'bootstrap-icons/icons/pencil.svg';
import Link from 'next/link';
import './style.scss'

export default function DashboardList ({ dashboards }: { dashboards: { name: string, properties: any, visibility: 'public' | 'private', items_count: number }[] }) {
  return (
    <div>
      <ul className="dashboard-table table-auto">
        {dashboards.map(item => (
          <li key={item.name}>
            <span className="column flex gap-2 items-center">
              <span className="text-lg">
                {item.name}
              </span>
              <span className="text-secondary text-xs">
                {item.items_count} widgets
              </span>
            </span>
            <div className="column flex gap-1 items-center">
              <Tooltip label="Visit dashboard">
                <Link className="btn btn-sm btn-link" href={item.name === 'default' ? `/` : `/dashboards/${item.name}`} prefetch={false}>
                  <BoxArrowUpRightIcon width={12} height={12} />
                </Link>
              </Tooltip>
              <Tooltip label="Edit dashboard">
                <Link className="btn btn-sm btn-link" href={`/dashboards/${item.name}/edit`} prefetch={false}>
                  <PencilIcon width={12} height={12} />
                </Link>
              </Tooltip>

              {item.name !== 'default' && (
                <>
                  <ChangeVisibleButton name={item.name} visibility={item.visibility} />
                  <DeleteDashboardButton name={item.name} />
                </>
              )}
            </div>
          </li>
        ))}
        <li className='border-2 border-dashed'>
          <AddDashboardForm />
        </li>
      </ul>
    </div>

  );
}