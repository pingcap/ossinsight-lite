'use client';
import DashboardIListItem from '@/components/pages/admin/dashboards/DashboardIListItem';
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
          <DashboardIListItem key={item.name} item={item} />
        ))}
        <li className='border-2 border-dashed'>
          <AddDashboardForm />
        </li>
      </ul>
    </div>

  );
}