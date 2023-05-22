'use server';

import { revalidatePath } from 'next/cache';
import { addTrackingRepo, deleteTrackingRepo } from '@/app/admin/repositories/op';

export async function addTrackingRepoAction (req: FormData) {
  const repoName = req.get('repo_name');
  if (typeof repoName !== 'string' || repoName.split('/').length !== 2) {
    throw new Error(`${repoName} is not a valid repo name`);
  }

  await addTrackingRepo(repoName);
  revalidatePath('/admin/repositories');
}

export async function deleteTrackingRepoAction (repoName: string) {
  if (typeof repoName !== 'string' || repoName.split('/').length !== 2) {
    throw new Error(`${repoName} is not a valid repo name`);
  }

  await deleteTrackingRepo(repoName);
  revalidatePath('/admin/repositories');
}
