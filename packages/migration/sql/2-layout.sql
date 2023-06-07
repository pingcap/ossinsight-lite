CREATE TABLE library_items
(
  id          VARCHAR(255) PRIMARY KEY NOT NULL,
  widget_name VARCHAR(255)             NOT NULL,
  properties  JSON                     NOT NULL,
  INDEX library_items_widget_name (widget_name)
);

CREATE TABLE dashboards
(
  name VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE dashboard_items
(
  dashboard_name VARCHAR(255) NOT NULL,
  item_id        VARCHAR(255) NOT NULL,
  properties     JSON         NOT NULL,
  PRIMARY KEY (dashboard_name, item_id),
  FOREIGN KEY library_items_id (item_id) REFERENCES library_items (id) ON DELETE CASCADE,
  FOREIGN KEY dashboards_name (dashboard_name) REFERENCES dashboards (name) ON DELETE CASCADE
);

