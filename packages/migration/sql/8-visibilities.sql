ALTER TABLE library_items
  ADD COLUMN visibility VARCHAR(31) DEFAULT 'public';

ALTER TABLE dashboards
  ADD COLUMN visibility VARCHAR(31) DEFAULT 'public';

