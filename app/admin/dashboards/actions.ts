'use server';
import { addDashboard, deleteDashboard } from '@/app/admin/dashboards/op';
import { revalidatePath } from 'next/cache';

export async function addDashboardAction (formData: FormData) {
  const name = formData.get('name');
  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await addDashboard(name);
  revalidatePath('/admin/dashboards');
}

export async function deleteDashboardAction (name: string) {
  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await deleteDashboard(name);
  revalidatePath('/admin/dashboards');
}
