import { SqlInterface } from '@/utils/mysql';

export function getDashboard (sql: SqlInterface, dashboard: string) {
  return sql<{ properties: any, visibility: 'public' | 'private' }>`
      SELECT properties, visibility
      FROM dashboards
      WHERE name = ${dashboard}
      LIMIT 1;
  `;
}

export function getPublicDashboard (sql: SqlInterface, dashboard: string) {
  return sql<{ properties: any, visibility: 'public' | 'private' }>`
      SELECT properties, visibility
      FROM dashboards
      WHERE name = ${dashboard}
        AND visibility = 'public'
      LIMIT 1;
  `;
}

export function getDashboardLibraryItems (sql: SqlInterface, dashboard: string) {
  return sql<{ item_id: string, properties: any, item_properties: any, widget_name: string, visibility: 'public' | 'private' }>`
      SELECT di.item_id     AS item_id,
             di.properties  AS properties,
             li.properties  AS item_properties,
             li.widget_name AS widget_name,
             li.visibility  AS visibility
      FROM dashboard_items di
               LEFT JOIN library_items li ON li.id = di.item_id
      WHERE dashboard_name = ${dashboard};
  `;
}

export function getDashboardPublicLibraryItems (sql: SqlInterface, dashboard: string) {
  return sql<{ item_id: string, properties: any, item_properties: any, widget_name: string, visibility: 'public' | 'private' }>`
      SELECT di.item_id     AS item_id,
             di.properties  AS properties,
             li.properties  AS item_properties,
             li.widget_name AS widget_name,
             li.visibility  AS visibility
      FROM dashboard_items di
               LEFT JOIN library_items li ON li.id = di.item_id
               LEFT JOIN dashboards d ON di.dashboard_name = d.name
      WHERE dashboard_name = ${dashboard}
        AND li.visibility = 'public'
        AND d.visibility = 'public';
  `;
}

export function getDashboards (sql: SqlInterface) {
  return sql<{ name: string, properties: any, visibility: 'public' | 'private' }>`
      SELECT name, properties, visibility
      FROM dashboards;
  `;
}

export function getPublicDashboards (sql: SqlInterface) {
  return sql<{ name: string, properties: any, visibility: 'public' | 'private' }>`
      SELECT name, properties, visibility
      FROM dashboards
      WHERE visibility = 'public';
  `;
}

export function getAllDashboardItems (sql: SqlInterface) {
  return sql<{ dashboard_name: string, item_id: string, properties: any }>`
      SELECT dashboard_name, item_id, properties
      FROM dashboard_items;
  `;
}

export function getAllPublicDashboardItems (sql: SqlInterface) {
  return sql<{ dashboard_name: string, item_id: string, properties: any }>`
      SELECT di.dashboard_name AS dashboard_name, di.item_id AS item_id, di.properties AS properties
      FROM dashboard_items di
               LEFT JOIN library_items li ON li.id = di.item_id
               LEFT JOIN dashboards d ON di.dashboard_name = d.name
      WHERE li.visibility = 'public'
        AND d.visibility = 'public';
  `;
}

export function getLibraryItem (sql: SqlInterface, id: string) {
  return sql.unique<{ id: string, widget_name: string, properties: any, visibility: 'public' | 'private' }>`
      SELECT id, widget_name, properties, visibility
      FROM library_items
      WHERE id = ${id}
  `;
}

export function getLibraryItems (sql: SqlInterface) {
  return sql<{ id: string, widget_name: string, properties: object, visibility: 'public' | 'private', dashboards: string[] }>`
      SELECT id,
             widget_name,
             li.properties                                                                    AS properties,
             visibility,
             IF(COUNT(di.dashboard_name) = 0, JSON_ARRAY(), JSON_ARRAYAGG(di.dashboard_name)) AS dashboards
      FROM library_items li
               LEFT JOIN dashboard_items di ON li.id = di.item_id
      GROUP BY 1, 2, 3, 4
  `;
}

export function getPublicLibraryItems (sql: SqlInterface) {
  return sql<{ id: string, widget_name: string, properties: object, visibility: 'public' | 'private', dashboards: string[] }>`
      SELECT id,
             widget_name,
             li.properties                                                                    AS properties,
             li.visibility                                                                    AS visibility,
             IF(COUNT(di.dashboard_name) = 0, JSON_ARRAY(), JSON_ARRAYAGG(di.dashboard_name)) AS dashboards
      FROM library_items li
               LEFT JOIN dashboard_items di ON li.id = di.item_id
               LEFT JOIN dashboards d ON d.name = di.dashboard_name
      WHERE li.visibility = 'public'
        AND d.visibility = 'public'
      GROUP BY 1, 2, 3, 4

  `;
}

export function getDashboardNames (sql: SqlInterface) {
  return sql<{ name: string }>`
      SELECT name
      FROM dashboards;
  `;
}

export function getPublicDashboardNames (sql: SqlInterface) {
  return sql<{ name: string }>`
      SELECT name
      FROM dashboards
      WHERE visibility = 'public';
  `;
}

export function getDashboardAbsentLibraryItems (sql: SqlInterface, dashboard: string) {
  return sql<{ id: string, widget_name: string, properties: any, visibility: 'public' | 'private' }>`
      SELECT id, widget_name, properties, visibility
      FROM library_items
      WHERE id NOT IN (SELECT item_id FROM dashboard_items WHERE dashboard_name = ${dashboard})
  `;
}
