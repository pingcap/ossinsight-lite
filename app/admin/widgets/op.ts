import { LibraryItem } from '@/src/types/config';
import { sql } from '@/src/utils/mysql';
import { groupItemsByCategory } from '@/src/utils/widgets';
import { notFound } from 'next/navigation';

export async function getWidgets () {
  return await sql<LibraryItem>`
      SELECT id, widget_name AS name, properties AS props
      FROM library_items
      WHERE widget_name NOT LIKE 'internal:%'
      ORDER BY widget_name, id
  `;
}

export async function addLibraryItem (item: LibraryItem) {
  await sql`
      INSERT INTO library_items (id, widget_name, properties)
      VALUES (${item.id}, ${item.name}, ${JSON.stringify(item.props)})
  `;
}

export async function getLibraryItem (id: string) {
  const item = await sql.unique<LibraryItem>`
      SELECT id, widget_name AS name, properties AS props
      FROM library_items
      WHERE id = ${id}
  `;
  if (!item) {
    notFound();
  }
  return item;
}