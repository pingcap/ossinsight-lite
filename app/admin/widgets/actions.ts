'use server';
import { LibraryItem } from '@/src/types/config';
import { addLibraryItem } from '@/app/admin/widgets/op';
import { revalidatePath } from 'next/cache';

export async function addLibraryItemAction (item: LibraryItem) {
  await addLibraryItem(item)

  revalidatePath('/admin/widgets')
}
